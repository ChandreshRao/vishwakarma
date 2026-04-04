# Codebase Architecture

## Overview
The Vishwakarma system employs a distinctive "Headless API-less CMS" architecture. Instead of relying on a real-time database or API, it uses an offline synchronization build step to convert Google Drive files into static JSON and assets, which are then consumed dynamically by the client.

## High-Level Data Flow
1. **Content Creation**: Content is modeled in Google Drive using standard folders (e.g., `01-About`, `04-Gallery`).
2. **Synchronization Layer**: At build time (or manually via `npm run sync`), `sync.py` recursively indexes the drive, parses markdown/docs, and outputs structured `.json` payloads.
3. **Static Provisioning**: Outputs land in the `public/content/` and `public/images/` directories.
4. **Client-Side Rendering**: The Vite React frontend loads in the browser, requests the static JSON files asynchronously, and renders the UI.

## Core Abstractions
### Asset Pipeline
The pipeline supports both `local` and `gdrive` modes interchangeably. Local mode relies on a mock source directory, ensuring local tests reflect the production cloud behavior. A cache (`.sync-cache.json`) operates to restrict API throttling for unmodified files.

### Frontend Routing
The frontend employs `react-router-dom` to map specific URL paths sequentially to mapped static content categories (e.g., `/about`, `/academics`). React contexts handle global configurations.

## Entry Points
- **Frontend Engine**: `src/main.jsx` and `index.html`.
- **Pipeline Engine**: `scripts/sync.py (def main())`.
