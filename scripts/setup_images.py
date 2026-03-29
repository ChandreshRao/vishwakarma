import urllib.request
import os
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

images = {
    "mock_gdrive/01-About/hero-bg.jpg": "https://picsum.photos/1200/800",
    "mock_gdrive/04-Gallery/campus-view.jpg": "https://picsum.photos/800/600",
    "mock_gdrive/04-Gallery/library.jpg": "https://picsum.photos/800/601",
    "mock_gdrive/04-Gallery/sports.jpg": "https://picsum.photos/800/602",
    "mock_gdrive/04-Gallery/arts.jpg": "https://picsum.photos/800/603"
}

for path, url in images.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    print(f"Downloading {path}...")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(path, 'wb') as out_file:
            out_file.write(response.read())
        print(f"Success: {path}")
    except Exception as e:
        print(f"Failed {path}: {e}")

print("Done.")
