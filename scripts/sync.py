import os
import json
import shutil
import re

# Configuration
SOURCE_DIR = os.getenv('SOURCE_DIR', 'mock_gdrive')
OUTPUT_DIR = 'src/content'
IMAGE_OUTPUT_DIR = 'public/images'
CONTENT_TYPES = ['01-About', '02-Academics', '03-Admissions', '04-Gallery', '05-Blog', '06-Disclosures']
IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}

def clean_output():
    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)
    os.makedirs(OUTPUT_DIR)
    
    if os.path.exists(IMAGE_OUTPUT_DIR):
        shutil.rmtree(IMAGE_OUTPUT_DIR)
    os.makedirs(IMAGE_OUTPUT_DIR)

def process_file(source_path, target_dir, target_image_dir):
    filename = os.path.basename(source_path)
    ext = os.path.splitext(filename)[1].lower()

    if ext in IMAGE_EXTENSIONS:
        target_path = os.path.join(target_image_dir, filename)
        shutil.copy2(source_path, target_path)
        return {
            "type": "image",
            "path": f"/images/{os.path.basename(target_image_dir)}/{filename}",
            "filename": filename
        }

    if not (ext == '.md' or ext == '.txt'):
        return None

    with open(source_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Simple logic to extract title from first # header or filename
    title_match = re.search(r'^#\s+(.*)$', content, re.MULTILINE)
    title = title_match.group(1) if title_match else filename.replace('.md', '').replace('-', ' ').title()
    
    # Remove the first header from content to avoid duplication
    clean_content = re.sub(r'^#\s+.*$', '', content, count=1, flags=re.MULTILINE).strip()

    data = {
        "title": title,
        "slug": filename.replace('.md', '').replace('.txt', ''),
        "content": clean_content,
        "type": os.path.basename(target_dir),
        "lastUpdated": os.path.getmtime(source_path)
    }

    target_path = os.path.join(target_dir, filename.replace('.md', '.json').replace('.txt', '.json'))
    with open(target_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
        
    return {"type": "markdown", "data": data}

def main():
    print(f"🚀 Starting sync from {SOURCE_DIR}...")
    clean_output()

    for content_type in CONTENT_TYPES:
        folder_prefix = content_type.split('-')[0]
        folder_name = content_type.split('-')[1].lower()
        
        source_type_dir = os.path.join(SOURCE_DIR, content_type)
        target_type_dir = os.path.join(OUTPUT_DIR, folder_name)
        target_image_dir = os.path.join(IMAGE_OUTPUT_DIR, folder_name)
        
        if not os.path.exists(source_type_dir):
            continue

        os.makedirs(target_type_dir, exist_ok=True)
        os.makedirs(target_image_dir, exist_ok=True)
        
        gallery_images = []

        for root, _, files in os.walk(source_type_dir):
            for file in files:
                source_path = os.path.join(root, file)
                result = process_file(source_path, target_type_dir, target_image_dir)
                
                if result and result["type"] == "image" and folder_name == "gallery":
                    gallery_images.append({
                        "title": file.split('.')[0].replace('-', ' ').title(),
                        "src": result["path"]
                    })
                print(f"✅ Processed {file}")
                
        if folder_name == "gallery":
            # Generate gallery manifest
            manifest_path = os.path.join(target_type_dir, 'index.json')
            with open(manifest_path, 'w', encoding='utf-8') as f:
                json.dump({"title": "Campus Gallery", "images": gallery_images}, f, indent=2)
            print(f"📁 Generated gallery manifest with {len(gallery_images)} images")

    print("✨ Sync complete!")

if __name__ == "__main__":
    main()
