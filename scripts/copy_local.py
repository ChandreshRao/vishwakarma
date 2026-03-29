import shutil, os, glob

os.makedirs('mock_gdrive/04-Gallery', exist_ok=True)
os.makedirs('mock_gdrive/01-About', exist_ok=True)

images = glob.glob('images/*.*')
print(f"Found {len(images)} images to copy.")

for img in images:
    target = os.path.join('mock_gdrive/04-Gallery', os.path.basename(img))
    shutil.copy(img, target)
    print(f"Copied {img} to gallery.")
    if 'School Image.png' in img:
        shutil.copy(img, 'mock_gdrive/01-About/hero-bg.png')
        print(f"Copied {img} as hero-bg.png.")
