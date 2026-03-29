# Jnanavahini School Website - Generic CMS

A professional, mobile-responsive school website built with React, Tailwind CSS, and a Google Drive-powered CMS.

## 🚀 Architecture
This site uses a **Generic CMS** architecture:
- **Source**: Content is authored in Google Docs/Markdown within a specific Google Drive folder.
- **Engine**: A Python script (`sync.py`) fetches files from Google Drive and converts them into structured JSON.
- **Frontend**: React (Vite) renders these JSON files as high-performance static pages.
- **CI/CD**: GitHub Actions automates the sync and deployment to GitHub Pages.

## 🛠 Setup & Configuration

### 1. Google Drive API
1. Create a project in the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the **Google Drive API**.
3. Create a **Service Account** and download the JSON key.
4. Share the target Google Drive folder with the Service Account email.

### 2. GitHub Secrets
Add the following secrets to your GitHub repository (`Settings > Secrets and variables > Actions`):
- `GDRIVE_SERVICE_ACCOUNT`: Paste the entire content of the Service Account JSON key.
- `GDRIVE_FOLDER_ID`: The ID of the root Google Drive folder (the string after `folders/` in the URL).

### 3. Local Development
For development without cloud credentials, use the `mock_gdrive/` folder:
```bash
npm install
npm run sync  # Processes mock_gdrive into src/content
npm run dev   # Starts the dev server
```

## 📁 Content Management (Staff Guide)
The website structure is driven by the folder hierarchy in Google Drive:
- `01-About`: History, Mission, etc.
- `02-Academics`: Curriculum, Calendar.
- `03-Admissions`: Admissions guide.
- `04-Gallery`: Images for the campus gallery.
- `05-Blog`: News and updates.
- `06-Disclosures`: Mandatory public disclosures (CBSE/State Board).

*See [staff_guide.md](staff_guide.md) for detailed naming rules.*

## ✨ Features
- **Mandatory Disclosures**: Dedicated section for board compliance.
- **360° Virtual Tour**: Integrated placeholder for immersive exploration.
- **High Performance**: 100% Static output for near-instant loading.
- **Accessibility**: WCAG-compliant design with high-contrast typography.

---
Built with ❤️ for Jnanavahini Education Society.
