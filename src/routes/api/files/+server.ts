// routes/api/files/+server.ts
import path from 'path';
import fs from 'fs';
import type { FileItem } from '$lib/types';
import { dev } from '$app/environment';
import { PUBLIC_DEV_DATA_DIR, PUBLIC_PROD_DATA_DIR } from '$env/static/public';

const dataDir = dev ? PUBLIC_DEV_DATA_DIR : PUBLIC_PROD_DATA_DIR;

function getFileType(filePath: string): 'image' | 'video' | 'other' {
  const extension = path.extname(filePath).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.gif'].includes(extension)) {
    return 'image';
  } else if (['.mp4', '.avi', '.mov'].includes(extension)) {
    return 'video';
  }
  return 'other';
}

function getPreviewSize(viewportWidth: number): number {
  if (viewportWidth <= 640) {
    return 350;
  } else if (viewportWidth <= 1024) {
    return 450;
  } else {
    return 550;
  }
}

function getFilesInFolder(folderPath: string, viewportWidth: number): FileItem[] {
  if (!dataDir) throw new Error('Data directory not set');
  const absolutePath = path.join(dataDir, folderPath);
  const files = fs.readdirSync(absolutePath, { withFileTypes: true });
  const fileItems: FileItem[] = [];
  const previewSize = getPreviewSize(viewportWidth);

  for (const file of files) {
    if (file.isFile()) {
      const filePath = path.join(absolutePath, file.name);
      const relativePath = path.relative(dataDir, filePath);
      const fileType = getFileType(file.name);

      if (fileType === 'image') {
        const previewUrl = `/api/image?path=${encodeURIComponent(relativePath)}&size=${previewSize}`;
        const fullUrl = `/api/image?path=${encodeURIComponent(relativePath)}`;

        fileItems.push({
          name: file.name,
          path: relativePath,
          type: fileType,
          previewUrl: previewUrl,
          fullUrl: fullUrl,
        });
      } else if (fileType === 'video') {
        const previewUrl = `/img/video_thumbnail.png`;
        const fullUrl = `/api/data?path=${encodeURIComponent(relativePath)}`;

        fileItems.push({
          name: file.name,
          path: relativePath,
          type: fileType,
          previewUrl: previewUrl,
          fullUrl: fullUrl,
        });
      } else {
        const fullUrl = `/api/data?path=${encodeURIComponent(relativePath)}`;

        fileItems.push({
          name: file.name,
          path: relativePath,
          type: fileType,
          fullUrl: fullUrl,
        });
      }
    }
  }

  return fileItems;
}


export async function GET({ url }: { url: URL }): Promise<Response> {
  if (!dataDir) throw new Error('Data directory not set');
  const folderPath = url.searchParams.get('path') || '';
  const viewportWidth = parseInt(url.searchParams.get('viewportWidth') || '0', 10);
  const absoluteFolderPath = path.join(dataDir, folderPath);

  if (!fs.existsSync(absoluteFolderPath)) {
    return new Response('Folder not found', { status: 404 });
  }

  const files = getFilesInFolder(folderPath, viewportWidth);

  return new Response(JSON.stringify(files), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}