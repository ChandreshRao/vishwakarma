import os
import json
import shutil
import re
import io
import requests
from datetime import datetime
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Configuration
PIPELINE_MODE = os.getenv('PIPELINE_MODE', 'local') # 'local' or 'gdrive'
SOURCE_DIR = os.getenv('SOURCE_DIR', 'mock_gdrive')
GDRIVE_FOLDER_ID = os.getenv('GDRIVE_FOLDER_ID')
SERVICE_ACCOUNT_KEY = os.getenv('GDRIVE_SERVICE_ACCOUNT_KEY') # JSON string

OUTPUT_DIR = 'public/content'
IMAGE_OUTPUT_DIR = 'public/images'
CONTENT_TYPES = {
    '00-Config': 'config',
    '01-About': 'about',
    '02-Academics': 'academics',
    '03-Admissions': 'admissions',
    '04-Gallery': 'gallery',
    '05-Blog': 'blog',
    '06-Disclosures': 'disclosures'
}
IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}

search_index = []

def clean_output():
    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)
    os.makedirs(OUTPUT_DIR)
    if os.path.exists(IMAGE_OUTPUT_DIR):
        shutil.rmtree(IMAGE_OUTPUT_DIR)
    os.makedirs(IMAGE_OUTPUT_DIR)

def parse_frontmatter(content):
    frontmatter = {}
    remaining_content = content
    match = re.match(r'^---\s*\n(.*?)\n---\s*\n', content, re.DOTALL)
    if match:
        yml_text = match.group(1)
        remaining_content = content[match.end():].strip()
        for line in yml_text.split('\n'):
            if ':' in line:
                key, val = line.split(':', 1)
                frontmatter[key.strip()] = val.strip().strip('"').strip("'")
    return frontmatter, remaining_content

def save_content(slug, title, content, metadata, category, last_updated_ts, target_dir):
    data = {
        "title": title,
        "slug": slug,
        "content": content,
        "metadata": metadata,
        "type": category,
        "lastUpdated": last_updated_ts,
        "formattedDate": datetime.fromtimestamp(last_updated_ts).strftime('%b %d, %Y')
    }
    
    excerpt = metadata.get('excerpt', content[:200].replace('\n', ' ') + '...')
    search_index.append({
        "title": title,
        "excerpt": excerpt,
        "slug": slug,
        "category": category,
        "tags": metadata.get('tags', '').split(',') if metadata.get('tags') else []
    })

    with open(os.path.join(target_dir, f"{slug}.json"), 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

def sync_local():
    print(f"🚀 Starting LOCAL sync from {SOURCE_DIR}...")
    for folder_key, folder_name in CONTENT_TYPES.items():
        source_type_dir = os.path.join(SOURCE_DIR, folder_key)
        target_dir = os.path.join(OUTPUT_DIR, folder_name)
        target_img_dir = os.path.join(IMAGE_OUTPUT_DIR, folder_name)
        
        if not os.path.exists(source_type_dir): continue
        os.makedirs(target_dir, exist_ok=True)
        os.makedirs(target_img_dir, exist_ok=True)

        gallery_images = []
        for root, _, files in os.walk(source_type_dir):
            for file in files:
                ext = os.path.splitext(file)[1].lower()
                source_path = os.path.join(root, file)
                
                if ext in IMAGE_EXTENSIONS:
                    shutil.copy2(source_path, os.path.join(target_img_dir, file))
                    if folder_name == "gallery":
                        gallery_images.append({"title": file.split('.')[0].replace('-', ' ').title(), "src": f"images/{folder_name}/{file}"})
                elif ext in {'.md', '.txt'}:
                    with open(source_path, 'r', encoding='utf-8') as f:
                        raw = f.read()
                    meta, body = parse_frontmatter(raw)
                    fn = os.path.splitext(file)[0]
                    save_content(meta.get('slug', fn), meta.get('title', fn.title()), body, meta, folder_name, os.path.getmtime(source_path), target_dir)
                print(f"✅ Processed {file}")
        
        if folder_name == "gallery":
            with open(os.path.join(target_dir, 'index.json'), 'w', encoding='utf-8') as f:
                json.dump({"title": "Campus Gallery", "images": gallery_images}, f, indent=2)

def sync_gdrive():
    print(f"☁️ Starting CLOUD sync from GDrive folder {GDRIVE_FOLDER_ID}...")
    if not SERVICE_ACCOUNT_KEY or not GDRIVE_FOLDER_ID:
        print("❌ Error: GDRIVE_SERVICE_ACCOUNT_KEY or GDRIVE_FOLDER_ID missing.")
        return

    creds = service_account.Credentials.from_service_account_info(json.loads(SERVICE_ACCOUNT_KEY))
    service = build('drive', 'v3', credentials=creds)

    # Fetch subfolders of ROOT
    results = service.files().list(q=f"'{GDRIVE_FOLDER_ID}' in parents and mimeType = 'application/vnd.google-apps.folder'", fields="files(id, name)").execute()
    folders = results.get('files', [])

    for folder in folders:
        # Match against our CONTENT_TYPES
        category = CONTENT_TYPES.get(folder['name'])
        if not category: continue
        
        print(f"📂 Processing folder: {folder['name']} -> {category}")
        target_dir = os.path.join(OUTPUT_DIR, category)
        target_img_dir = os.path.join(IMAGE_OUTPUT_DIR, category)
        os.makedirs(target_dir, exist_ok=True)
        os.makedirs(target_img_dir, exist_ok=True)

        files_results = service.files().list(q=f"'{folder['id']}' in parents", fields="files(id, name, mimeType, modifiedTime)").execute()
        files = files_results.get('files', [])
        gallery_images = []

        for file in files:
            name = file['name']
            ext = os.path.splitext(name)[1].lower()
            last_mod = datetime.fromisoformat(file['modifiedTime'].replace('Z', '+00:00')).timestamp()

            if ext in IMAGE_EXTENSIONS:
                request = service.files().get_media(fileId=file['id'])
                with open(os.path.join(target_img_dir, name), 'wb') as f:
                    downloader = MediaIoBaseDownload(f, request)
                    done = False
                    while not done: _, done = downloader.next_chunk()
                if category == "gallery":
                    gallery_images.append({"title": name.split('.')[0].replace('-', ' ').title(), "src": f"images/{category}/{name}"})
            elif ext in {'.md', '.txt'}:
                request = service.files().get_media(fileId=file['id'])
                fh = io.BytesIO()
                downloader = MediaIoBaseDownload(fh, request)
                done = False
                while not done: _, done = downloader.next_chunk()
                raw = fh.getvalue().decode('utf-8')
                meta, body = parse_frontmatter(raw)
                fn = os.path.splitext(name)[0]
                save_content(meta.get('slug', fn), meta.get('title', fn.title()), body, meta, category, last_mod, target_dir)
            print(f"✅ Sync'd {name}")

        if category == "gallery":
            with open(os.path.join(target_dir, 'index.json'), 'w', encoding='utf-8') as f:
                json.dump({"title": "Campus Gallery", "images": gallery_images}, f, indent=2)

def main():
    clean_output()
    if PIPELINE_MODE == 'gdrive':
        sync_gdrive()
    else:
        sync_local()
    
    with open(os.path.join(OUTPUT_DIR, 'search-index.json'), 'w', encoding='utf-8') as f:
        json.dump(search_index, f, indent=2)
    print(f"🔍 Generated search index with {len(search_index)} entries")
    print(f"✨ Sync complete! ({PIPELINE_MODE} mode)")

if __name__ == "__main__":
    main()
