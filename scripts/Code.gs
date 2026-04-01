/**
 * Vishwakarma CMS - Google Apps Script Bridge
 * 
 * Instructions:
 * 1. Go to script.google.com and create a New Project.
 * 2. Paste this code.
 * 3. Click "Deploy" > "New Deployment".
 * 4. Select "Web App".
 * 5. Execute as: "Me".
 * 6. Who has access: "Anyone".
 * 7. Copy the Web App URL for Phase 3.
 */

const FOLDER_ID = "YOUR_FOLDER_ID_HERE"; // Update this with your main folder ID

function doGet(e) {
  try {
    const parentFolder = DriveApp.getFolderById(FOLDER_ID);
    const content = scanFolder(parentFolder);
    
    return ContentService.createTextOutput(JSON.stringify(content))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function scanFolder(folder) {
  const result = {
    name: folder.getName(),
    folders: [],
    files: []
  };

  // Scan subfolders
  const subfolders = folder.getFolders();
  while (subfolders.hasNext()) {
    result.folders.push(scanFolder(subfolders.next()));
  }

  // Scan files
  const files = folder.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    const mimeType = file.getMimeType();
    
    // Only fetch Markdown and Web-ready images
    if (mimeType === "text/markdown" || mimeType === "application/octet-stream" || 
        mimeType.indexOf("image/") !== -1 || mimeType === "text/plain") {
      
      result.files.push({
        id: file.getId(),
        name: file.getName(),
        mimeType: mimeType,
        lastUpdated: file.getLastUpdated().getTime(),
        downloadUrl: `https://docs.google.com/uc?export=download&id=${file.getId()}`
      });
    }
  }

  return result;
}
