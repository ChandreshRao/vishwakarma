# Directory Structure

## Overview
A detailed look at the directory layout, emphasizing where modifications should safely reside to conform to the project's layout principles.

## Root Level
- `src/`: The main repository of all React frontend codebase and related styling.
- `scripts/`: Python and Node.js operational scripts designated for pipelines and system migrations.
- `public/`: Statically-served files. Includes the pipeline outputs (`content/`, `images/`) which are ephemeral and generated dynamically, as well as static constants.
- `.github/`: Houses GitHub Action definitions for CI/CD pipelines (e.g., `sync-and-deploy.yml`).
- `.planning/`: GSD workflow and automation configurations and temporary caches.

## Deep Dive: /src
- `/src/components/`: Modular, reusable UI chunks (e.g., Cards, Buttons, Carousels).
- `/src/context/`: React context providers (e.g., `ConfigContext.jsx`).
- `/src/App.jsx`: Global route definitions and root layout structure.
- `/src/index.css`: Primary entry CSS file with Tailwind directives.

## Deep Dive: /scripts
- `sync.py`: The critical bridging mechanism reading from Google Drive.
- `setup_images.py` & `copy_local.py`: Ancillary local-testing mock generators.
- `check-sync.js`: Node validation to ensure local content exists before Vite bootups.

## Naming Conventions
- React components use `PascalCase.jsx`.
- Script files use `snake_case.py` or `kebab-case.js`.
- Generated content files leverage URL-friendly `slugs.json`.
