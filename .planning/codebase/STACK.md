# Codebase Stack

## Overview
This document outlines the core technologies, frameworks, and dependencies used in the Vishwakarma school website project. The project is primarily a modern React frontend with a Python-based synchronization script for content management via Google Drive.

## Frontend Stack
- **Library**: `React` (v19.0.0) with `react-dom`
- **Build Tool**: `Vite` (v6.2.0) for fast module replacement and minimal build sizes.
- **Styling**: `TailwindCSS` (v4.0.9) bundled via `@tailwindcss/vite` plugin.
  - Complemented with `clsx` and `tailwind-merge` for dynamic class assignment.
- **Routing**: `react-router-dom` (v7.2.0)
- **UI & Animations**: 
  - `framer-motion` for complex page transitions and micro-interactions.
  - `@headlessui/react` for accessible, unstyled UI components.
  - `lucide-react` for iconography.
- **Markdown Processing**: `react-markdown` and `gray-matter`.

## Backend / Build Scripts
- **Language**: `Python` (Scripts only, no active backend server running).
- **Core Dependencies**:
  - `google-auth` and `google-api-python-client` for Google Drive API interactions.
  - `python-frontmatter` for parsing markdown metadata.
  - `python-dotenv` for loading environment configurations securely.

## Runtime & Deployment
- **Containerization**: `Docker` and `Docker Compose` are configured for local development and potential production deployment.
- **Hosting**: Deployed on Netlify, configured via `netlify.toml`.
- **Node Environment**: Node.js ecosystem (identified by `package.json`).
