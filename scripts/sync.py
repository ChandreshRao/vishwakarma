import os
import json
import shutil
import re
from datetime import datetime

# Configuration
SOURCE_DIR = os.getenv('SOURCE_DIR', 'mock_gdrive')
OUTPUT_DIR = 'public/content'
IMAGE_OUTPUT_DIR = 'public/images'
# Define standard content types (folders mapping)
CONTENT_TYPES = {
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
    """
    Parses YAML frontmatter between --- blocks using regex.
    """
    frontmatter = {}
    remaining_content = content
    
    match = re.match(r'^---\s*\n(.*?)\n---\s*\n', content, re.DOTALL)
    if match:
        yml_text = match.group(1)
        remaining_content = content[match.end():].strip()
        # Simple key-value parser for basic YAML
        for line in yml_text.split('\n'):
            if ':' in line:
                key, val = line.split(':', 1)
                frontmatter[key.strip()] = val.strip().strip('"').strip("'")
                
    return frontmatter, remaining_content

def process_file(source_path, target_dir, target_image_dir, base_url):
    filename = os.path.basename(source_path)
    fn_no_ext, ext = os.path.splitext(filename)
    ext = ext.lower()

    if ext in IMAGE_EXTENSIONS:
        target_path = os.path.join(target_image_dir, filename)
        shutil.copy2(source_path, target_path)
        return {
            "type": "image",
            "path": f"/images/{os.path.basename(target_image_dir)}/{filename}",
            "filename": filename
        }

    if ext not in {'.md', '.txt'}:
        return None

    with open(source_path, 'r', encoding='utf-8') as f:
        raw_content = f.read()
    
    metadata, content = parse_frontmatter(raw_content)
    
    # Title extraction fallback: 1. Metadata 2. First H1 3. Filename
    title = metadata.get('title')
    if not title:
        title_match = re.search(r'^#\s+(.*)$', content, re.MULTILINE)
        title = title_match.group(1) if title_match else fn_no_ext.replace('-', ' ').title()
        # Remove the first header from content if it matches the title to avoid duplication
        content = re.sub(r'^#\s+.*$', '', content, count=1, flags=re.MULTILINE).strip()

    # Generate slug
    slug = metadata.get('slug', fn_no_ext)
    
    data = {
        "title": title,
        "slug": slug,
        "content": content,
        "metadata": metadata,
        "type": os.path.basename(target_dir),
        "lastUpdated": os.path.getmtime(source_path),
        "formattedDate": datetime.fromtimestamp(os.path.getmtime(source_path)).strftime('%b %d, %Y')
    }

    # Add to search index
    excerpt = metadata.get('excerpt', content[:200].replace('\n', ' ') + '...')
    search_index.append({
        "title": title,
        "excerpt": excerpt,
        "slug": slug,
        "category": data["type"],
        "tags": metadata.get('tags', '').split(',') if metadata.get('tags') else []
    })

    target_path = os.path.join(target_dir, f"{slug}.json")
    with open(target_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
        
    return {"type": "markdown", "data": data}

def main():
    print(f"🚀 Starting LOCAL sync from {SOURCE_DIR}...")
    clean_output()

    for folder_key, folder_name in CONTENT_TYPES.items():
        source_type_dir = os.path.join(SOURCE_DIR, folder_key)
        target_type_dir = os.path.join(OUTPUT_DIR, folder_name)
        target_image_dir = os.path.join(IMAGE_OUTPUT_DIR, folder_name)
        
        if not os.path.exists(source_type_dir):
            continue

        os.makedirs(target_type_dir, exist_ok=True)
        os.makedirs(target_image_dir, exist_ok=True)
        
        gallery_images = []

        # Use os.walk for recursive processing (Nested Folders Support)
        for root, _, files in os.walk(source_type_dir):
            # Maintain relative directory structure if needed, or flatten?
            # For now, we flatten but keep the relative path in mind for target_dir if we wanted sub-slugs
            # ASSUMPTION: We flatten into categories for the basic router logic
            for file in files:
                source_path = os.path.join(root, file)
                result = process_file(source_path, target_type_dir, target_image_dir, folder_name)
                
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

    # Finalize search index
    with open(os.path.join(OUTPUT_DIR, 'search-index.json'), 'w', encoding='utf-8') as f:
        json.dump(search_index, f, indent=2)
    print(f"🔍 Generated search index with {len(search_index)} entries")

    print("✨ Local Sync complete!")

if __name__ == "__main__":
    main()
