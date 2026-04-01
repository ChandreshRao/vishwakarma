# 🔱 Vishwakarma: Zero-Cost School CMS

[![Deploy School CMS](https://github.com/your-username/vishwakarma/actions/workflows/deploy.yml/badge.svg)](https://github.com/your-username/vishwakarma/actions/workflows/deploy.yml)

A premium, high-performance school website builder powered by **Google Drive**, built with **React 19**, and deployed for free via **GitHub Pages**.

---

## 🎨 Branding & Identity
To white-label the website for your school, edit the **`src/siteConfig.js`** file. You can change:
- School Name & Initials
- Tagline & Description
- Contact Info (Email, Phone, Address)
- Established Year & Trust Details
- Social Media Links

---

## 🚀 The Architecture
Vishwakarma operates on a "Headless Static" model:
1.  **Content (Source)**: Staff edit Markdown and upload images to a specific Google Drive folder.
2.  **Sync Engine**: A Python pipeline (`sync.py`) fetches cloud data, parses YAML frontmatter, generates a static search index, and optimizes assets.
3.  **Frontend**: A cinematic React 19 application renders the data with **Framer Motion** animations.
4.  **Deployment**: GitHub Actions triggers a sync-and-build process, hosting the site on GitHub Pages with zero server costs.

---

## ✨ Premium Features
-   **🔍 Cinematic Search**: Instant global search (`Ctrl + K`) powered by a static pre-built index.
-   **🌐 360° Virtual Tour**: Immersive campus exploration built with Pannellum.
-   **🎭 Staggered Animations**: Elegant, "Modern Heritage" layout reveals for all sections.
-   **📱 Mobile-First**: Fully responsive design with a custom organic framing system.
-   **📂 Auto-Sync**: One-click (or automated) content updates from Google Drive.

---

## 🛠️ Local Development

### 1. Installation
```powershell
# Install Node dependencies
npm install

# Install Python sync dependencies
pip install -r requirements.txt
```

### 2. Configuration (`.env`)
Create a `.env` file in the root directory (see `.env.template`):
```env
PIPELINE_MODE=gdrive
GDRIVE_FOLDER_ID="your_folder_id"
GDRIVE_SERVICE_ACCOUNT_KEY='{"your_json_key": "..."}'
```

### 3. Run the App
```powershell
npm run dev
```
*Note: `npm run dev` automatically runs the `sync.py` script first to ensure your local preview has the latest content.*

---

## 🐳 Docker Setup
For a consistent environment, you can run the entire pipeline via Docker:

```powershell
# Build and run the production-ready container
docker compose up --build
```
The site will be available at `http://localhost:8080`.

---

## ⚙️ Cloud Infrastructure Setup (Free)

### Phase 1: Google Cloud Project
1.  Enable **Google Drive API** in the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a **Service Account** with the **Editor** role.
3.  Download the **JSON Key** and share your Drive folder with the service account email.

### Phase 2: GitHub Integration
Add your credentials to **GitHub Secrets** (`Settings > Secrets > Actions`):
-   `GDRIVE_SERVICE_ACCOUNT_KEY`: The full content of your JSON key.
-   `GDRIVE_FOLDER_ID`: The ID of your main Google Drive folder.

---

## 📁 Content Structure
Maintain this hierarchy in Google Drive for automatic sorting:
-   `01-About`: History, Mission, Achievements.
-   `02-Academics`: Curriculum, Ecosystem.
-   `03-Admissions`: Procedures, Fees.
-   `04-Gallery`: Campus photos.
-   `05-Blog`: News and updates.
-   `06-Disclosures`: Mandatory public disclosures.

---
Built with ❤️ by **Vishwakarma CMS**.