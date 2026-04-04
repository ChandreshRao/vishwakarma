# Testing Landscape

## Overview
This document defines the automated verifications applied across the application repository. At the time of codebase evaluation, comprehensive structural test pipelines require development, with unit and integration foundations awaiting introduction.

## Current Testing Setup
- **Continuous Integration**: Uses GitHub Actions spanning manual deployments and pipeline executions.
- **Linters**: `ESLint` ensures that code passes functional constraints prior to Vite building steps.

## Future Testing Trajectories (Recommended)
1. **Unit Testing (Frontend)**:
   - Framework: `Vitest` integrated closely with current Vite build structures.
   - Purpose: Verifying isolated UI component rendering and basic prop functionality.
2. **Integration Checks (Pipeline)**:
   - Implementing standard assertions in Python with `pytest`.
   - Purpose: Ensuring GDrive authentication handles variable failures correctly instead of catastrophic crashes without logs.
3. **End-to-End Analysis (E2E)**:
   - Framework: `Playwright` or `Cypress`.
   - Purpose: Mapping realistic journeys through the generated JSON tree in deployment.

## Pipeline Confidence
Presently, the `sync.py` mechanism implements fail-safes. The script will halt entirely ("HARD FAIL") if `site-config.json` fails to generate from root directory logic, effectively behaving as an infrastructural system test designed to block bad builds.
