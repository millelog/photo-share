// routes/api/image/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { resolve } from 'path';
import { stat } from 'fs/promises';
import sharp from 'sharp';
import { PUBLIC_DEV_DATA_DIR, PUBLIC_PROD_DATA_DIR } from '$env/static/public';
import path from 'path';

const isDev = process.env.NODE_ENV === 'development';
const dataDir = isDev ? PUBLIC_DEV_DATA_DIR : PUBLIC_PROD_DATA_DIR;

// Helper function to sanitize and validate file paths
function sanitizeFilePath(filePath: string): string | null {
  if (!dataDir) throw new Error('Data directory not set');
  if (!filePath) {
    return null;
  }
  const resolvedPath = resolve(dataDir, filePath);
  if (resolvedPath.startsWith(dataDir)) {
    return resolvedPath;
  }
  return null;
}

export const GET: RequestHandler = async ({ url }) => {
  const filePath = url.searchParams.get('path');
  const size = parseInt(url.searchParams.get('size') || '0');

  if (!filePath) {
    return new Response('Missing file path', {
      status: 400,
    });
  }

  const sanitizedFilePath = sanitizeFilePath(filePath);

  if (!sanitizedFilePath) {
    return new Response('Invalid file path', {
      status: 400,
    });
  }

  try {
    const fileStat = await stat(sanitizedFilePath);
    if (!fileStat.isFile()) {
      return new Response('Not a valid file', {
        status: 400,
      });
    }

    const transformer = sharp(sanitizedFilePath);

    if (size > 0) {
      transformer.resize({ width: size, height: size, fit: 'inside' });
    }

    const transformedBuffer = await transformer.toFormat('jpeg').toBuffer();

    return new Response(transformedBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `inline; filename="${path.basename(sanitizedFilePath)}"`,
      },
    });
  } catch (error) {
    console.error('Error processing file:', error);
    return new Response('Error processing file', {
      status: 500,
    });
  }
};