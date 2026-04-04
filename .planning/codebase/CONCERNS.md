# Risks & Concerns

## Overview
A detailed accounting of known fragile points, operational bottlenecks, identified architectural limitations, and accumulated technical debt that requires observation or future mitigation.

## Infrastructure Brittleness
- **Google Drive Coupling**: The `sync.py` backend tightly couples folder naming constraints (`01-About`, `04-Gallery`) to UI mechanisms. If an administrator maliciously or inadvertently changes a parent directory's nomenclature, the ingestion sequence fails silently or miscategorizes data blocks.
- **Pipeline Timing**: `sync.py` recursively indexes an entire Cloud Directory sequence. Large media inclusions may potentially cause timeout triggers inside CI/CD processes.

## Scalability Risks
- **JSON File Saturation**: Fetching singular small `.json` packages is efficient at first, but scaling horizontally to thousands of students, blogs, and image files risks fragmenting network requests leading to waterfall effect latencies absent an organized batch-request methodology.

## Security Observations
- Authentication leverages rigid JSON `SA` (Service Account) payloads injected via env variables (`GDRIVE_SERVICE_ACCOUNT_KEY`). Secure management and periodic rotation inside systems (Netlify Environment properties) are required to thwart exposure events.

## Missing Tooling
- The project is pure JS; migrating to `TypeScript` would solve variable un-structuring errors during JSON ingestion inherently. 
- Limited unit-tests dictate extensive manual UAT verifications.
