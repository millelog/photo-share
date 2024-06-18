// src/routes/api/data/+server.ts
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

function buildFileTree(baseUrl: string): FileTreeItem[] {
  const files = isDev ? getFilesFromDisk(dataDir) : import.meta.glob('/data/**/*', { eager: true });
  const fileTree: FileTreeItem[] = [];

  for (const filePath in files) {
    const file = files[filePath];
    const relativePath = isDev ? path.relative(dataDir, filePath) : filePath.replace('/data/', '');
    const pathParts = relativePath.split(path.sep);
    const fileName = pathParts[pathParts.length - 1];

    if (isDev ? fs.statSync(filePath).isDirectory() : file instanceof Array) {
      // It's a folder
      fileTree.push({
        name: fileName,
        path: relativePath,
        type: 'folder',
        children: buildFileTree(`${baseUrl}/${relativePath}`),
      });
    } else {
      // It's a file
      const fileType = getFileType(fileName);
      const previewUrl = fileType !== 'other' ? `${baseUrl}/${relativePath}` : undefined;

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

  function traverseDirectory(currentDir: string) {
    const dirContents = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const item of dirContents) {
      const itemPath = path.join(currentDir, item.name);
      if (item.isDirectory()) {
        files[itemPath] = [];
        traverseDirectory(itemPath);
      } else {
        files[itemPath] = true;
      }
    }
  }

  traverseDirectory(directory);
  return files;
}

export async function GET({ url }: { url: URL }): Promise<Response> {
  try {
    const baseUrl = isDev ? `${url.origin}/data` : '/data';
    const fileTree = buildFileTree(baseUrl);
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