import path from 'path';
import fs from 'fs';
import type { FolderItem } from '$lib/types';

const isDev = process.env.NODE_ENV === 'development';
const dataDir = isDev ? 'C:\\Users\\Logan\\Pictures\\photo-share' : '/data';

function getFolderTree(currentPath: string): FolderItem[] {
  const items = fs.readdirSync(currentPath, { withFileTypes: true });
  const folderItems: FolderItem[] = [];

  for (const item of items) {
    if (item.isDirectory() && item.name !== 'prev') {
      const folderPath = path.join(currentPath, item.name);
      const folderItem: FolderItem = {
        name: item.name,
        path: path.relative(dataDir, folderPath),
        children: getFolderTree(folderPath),
      };
      folderItems.push(folderItem);
    }
  }

  return folderItems;
}

export async function GET(): Promise<Response> {
  const folderTree = getFolderTree(dataDir);

  return new Response(JSON.stringify(folderTree), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
