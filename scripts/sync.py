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
CACHE_FILE = os.path.join(OUTPUT_DIR, '.sync-cache.json')

search_index = []

def ensure_directories():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(IMAGE_OUTPUT_DIR, exist_ok=True)

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

def load_cache():
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            pass
    return {}

def save_cache(cache):
    os.makedirs(os.path.dirname(CACHE_FILE), exist_ok=True)
    with open(CACHE_FILE, 'w', encoding='utf-8') as f:
        json.dump(cache, f, indent=2)

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
        # Flexible folder matching (Case-insensitive, ignoring spacing/numbering)
        folder_clean = re.sub(r'^\d+[\s-]*', '', folder['name']).lower().strip()
        category = None
        for key, val in CONTENT_TYPES.items():
            key_clean = re.sub(r'^\d+[\s-]*', '', key).lower().strip()
            if folder_clean == key_clean or folder_clean == val:
                category = val
                break

        if not category: continue
        print(f"📂 Processing folder: '{folder['name']}' (ID: {folder['id']}) -> '{category}'")
        target_dir = os.path.join(OUTPUT_DIR, category)
        target_img_dir = os.path.join(IMAGE_OUTPUT_DIR, category)
        os.makedirs(target_dir, exist_ok=True)
        os.makedirs(target_img_dir, exist_ok=True)

        files_results = service.files().list(q=f"'{folder['id']}' in parents", fields="files(id, name, mimeType, modifiedTime)").execute()
        files = files_results.get('files', [])
        gallery_images = []

        sync_cache = load_cache()
        for file in files:
            file_id = file['id']
            name = file['name']
            mime = file['mimeType']
            ext = os.path.splitext(name)[1].lower()
            last_mod = file['modifiedTime']
            last_mod_ts = datetime.fromisoformat(last_mod.replace('Z', '+00:00')).timestamp()

            is_gdoc = mime == 'application/vnd.google-apps.document'
            
            # Skip cache if debugging or check cache
            cache_entry = sync_cache.get(file_id)
            is_cached = cache_entry and cache_entry.get('modifiedTime') == last_mod

            if is_cached:
                if ext in IMAGE_EXTENSIONS:
                    gallery_images.append({"title": name.split('.')[0].replace('-', ' ').title(), "src": f"images/{category}/{name}"})
                elif ext in {'.md', '.txt'} or is_gdoc:
                    json_path = cache_entry.get('json_path')
                    if json_path and os.path.exists(json_path):
                        with open(json_path, 'r', encoding='utf-8') as f:
                            data = json.load(f)
                            excerpt = data.get('metadata', {}).get('excerpt', data.get('content', '')[:200].replace('\n', ' ') + '...')
                            search_index.append({
                                "title": data.get('title'),
                                "excerpt": excerpt,
                                "slug": data.get('slug'),
                                "category": category,
                                "tags": data.get('metadata', {}).get('tags', '').split(',') if data.get('metadata', {}).get('tags') else []
                            })
                print(f"⏭️  Skipped {name} (Cached)")
                continue

            print(f"📄 Syncing: {name} ({mime})")
            
            if ext in IMAGE_EXTENSIONS:
                request = service.files().get_media(fileId=file_id)
                with open(os.path.join(target_img_dir, name), 'wb') as f:
                    downloader = MediaIoBaseDownload(f, request)
                    done = False
                    while not done: _, done = downloader.next_chunk()
                if category == "gallery":
                    gallery_images.append({"title": name.split('.')[0].replace('-', ' ').title(), "src": f"images/{category}/{name}"})
                sync_cache[file_id] = {'modifiedTime': last_mod}
                    
            elif ext in {'.md', '.txt'} or is_gdoc:
                if is_gdoc:
                    request = service.files().export_media(fileId=file_id, mimeType='text/plain')
                else:
                    request = service.files().get_media(fileId=file_id)
                
                fh = io.BytesIO()
                downloader = MediaIoBaseDownload(fh, request)
                done = False
                while not done: _, done = downloader.next_chunk()
                raw = fh.getvalue().decode('utf-8')
                meta, body = parse_frontmatter(raw)
                fn = os.path.splitext(name)[0]
                slug = meta.get('slug', fn)
                save_content(slug, meta.get('title', fn.title()), body, meta, category, last_mod_ts, target_dir)
                sync_cache[file_id] = {
                    'modifiedTime': last_mod,
                    'json_path': os.path.join(target_dir, f"{slug}.json")
                }
                print(f"✅ Sync'd {name}")
            save_cache(sync_cache)

        if category == "gallery":
            with open(os.path.join(target_dir, 'index.json'), 'w', encoding='utf-8') as f:
                json.dump({"title": "Campus Gallery", "images": gallery_images}, f, indent=2)

def main():
    ensure_directories()
    if PIPELINE_MODE == 'gdrive':
        sync_gdrive()
    else:
        sync_local()
    
    # Critical Check: Verify if config was loaded
    config_file = os.path.join(OUTPUT_DIR, 'config', 'site-config.json')
    if not os.path.exists(config_file):
        print(f"❌ CRITICAL ERROR: '{config_file}' was not generated.")
        print("Please check your GDRIVE_FOLDER_ID and folder naming in Drive.")
        import sys
        sys.exit(1) # HARD FAIL - Stops the Netlify build
    
    with open(os.path.join(OUTPUT_DIR, 'search-index.json'), 'w', encoding='utf-8') as f:
        json.dump(search_index, f, indent=2)
    print(f"🔍 Generated search index with {len(search_index)} entries")
    print(f"✨ Sync complete! ({PIPELINE_MODE} mode)")

if __name__ == "__main__":
    main()
