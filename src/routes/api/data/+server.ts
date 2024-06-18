import path from 'path';
import fs from 'fs';
import type { FileTreeItem } from '$lib/types';

const isDev = process.env.NODE_ENV === 'development';
const dataDir = isDev ? 'C:\\Users\\Logan\\Pictures\\photo-share' : '/data';

function getFileType(filePath: string): 'image' | 'video' | 'other' {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === '.jpg' || extension === '.jpeg' || extension === '.png' || extension === '.gif') {
    return 'image';
  } else if (extension === '.mp4' || extension === '.avi' || extension === '.mov') {
    return 'video';
  }
  return 'other';
}

function buildFileTree(baseDir: string, baseUrl: string): FileTreeItem[] {
  const files = getFilesFromDisk(baseDir);
  const fileTree: FileTreeItem[] = [];

  for (const filePath in files) {
    const relativePath = path.relative(dataDir, filePath);
    const pathParts = relativePath.split(path.sep);
    const fileName = pathParts[pathParts.length - 1];


    if (files[filePath] === 'directory') {
      // It's a folder
      fileTree.push({
        name: fileName,
        path: relativePath,
        type: 'folder',
        children: buildFileTree(path.join(baseDir, fileName), `${baseUrl}/${relativePath}`),
      });
    } else {
      // It's a file
      const fileType = getFileType(fileName);
      const previewUrl = fileType !== 'other' ? `/api/data?path=${encodeURIComponent(filePath)}` : undefined;


      fileTree.push({
        name: fileName,
        path: relativePath,
        type: fileType,
        previewUrl,
      });
    }
  }

  return fileTree;
}

function getFilesFromDisk(directory: string): Record<string, any> {
    const files: Record<string, any> = {};
  
    function traverseDirectory(currentDir: string, parentDirs: string[] = []) {
      if (parentDirs.includes(currentDir)) {
        // Prevent infinite recursion if a symlink or junction points back to a parent directory
        return;
      }
  
  
      let dirContents;
      try {
        dirContents = fs.readdirSync(currentDir, { withFileTypes: true });
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.error(`Directory not found: ${currentDir}`);
          return;
        } else {
          throw err;
        }
      }
  
      for (const item of dirContents) {
        const itemPath = path.join(currentDir, item.name);
        if (item.isDirectory()) {
          files[itemPath] = 'directory';
          traverseDirectory(itemPath, [...parentDirs, currentDir]);
        } else {
          files[itemPath] = 'file';
        }
      }
    }
  
    traverseDirectory(directory);
    return files;
  }

export async function GET({ url }: { url: URL }): Promise<Response> {
  try {
    const baseUrl = isDev ? `${url.origin}/data` : '/data';
    const fileTree = buildFileTree(dataDir, baseUrl);
    return new Response(JSON.stringify(fileTree), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching file tree:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
