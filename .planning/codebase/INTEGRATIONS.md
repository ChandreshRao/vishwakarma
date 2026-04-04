# Integrations Map

## Overview
This document catalogs external services, APIs, databases, and third-party interactions that the application relies upon to function, both in development and production environments.

## Content Management System (CMS) Pipeline
### Google Drive API
- **Purpose**: Acts as the primary backend and CMS for the application. School administrators formulate content (folders, documents, images) strictly within a shared Google Drive.
- **Implementation**: `scripts/sync.py` authenticates via Google Service Accounts (`GDRIVE_SERVICE_ACCOUNT_KEY`) to fetch folder structures.
- **Data Flow**: Fetches raw content (GDocs, Markdown, Text files) and media, converting and persisting them into local `public/content/` JSON files and `public/images/`.

### Google Apps Script
- **Purpose**: There is a `scripts/Code.gs` file indicative of Google Apps Script integration.
- **Usage**: Likely utilized for specific automation tasks within Google Workspace (e.g., auto-formatting Google Docs, or triggering webhooks when content changes).

## Deployment & Hosting Integrations
### Netlify
- **Purpose**: Primary hosting provider for the frontend application.
- **Setup**: Regulated by `netlify.toml` which defines build commands (`npm run build` triggering the python sync script first) and publish directories (`dist`).

## Authentication & Security
- **Providers**: No end-user authentication framework runs on the application. Administrative authentication for content synchronization uses **Google Cloud IAM (Service Accounts)**.
