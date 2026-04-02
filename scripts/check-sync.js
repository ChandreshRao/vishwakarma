import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const CONTENT_PATH = path.join(process.cwd(), 'public/content');
const SEARCH_INDEX = path.join(CONTENT_PATH, 'search-index.json');

console.log("\n🔍 Checking for school content...");

if (!fs.existsSync(CONTENT_PATH) || !fs.existsSync(SEARCH_INDEX)) {
  console.log("⚠️  No local content found. Running one-time sync from Google Drive...");
  try {
    execSync('npm run sync', { stdio: 'inherit' });
  } catch (error) {
    console.error("❌ Failed to sync content. Please check your .env credentials.");
    process.exit(1);
  }
} else {
  console.log("✅ Using existing local content.");
  console.log("💡 Note: Run 'npm run sync' to fetch the latest updates from Google Drive.\n");
}
