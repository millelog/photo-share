// src/routes/api/download/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { resolve } from 'path';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';

const isDev = process.env.NODE_ENV === 'development';
const dataDir = isDev ? 'C:\\Users\\Logan\\Pictures\\photo-share' : '/data';

// Helper function to sanitize and validate file paths
function sanitizeFilePath(filePath: string): string | null {
  const resolvedPath = resolve(dataDir, filePath);
  if (resolvedPath.startsWith(dataDir)) {
    return resolvedPath;
  }
  return null;
}

export const POST: RequestHandler = async ({ request }) => {
  const formData = await request.formData();
  const filePath = formData.get('filePath') as string;

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

    const stream = new ReadableStream({
      start(controller) {
        const fileStream = createReadStream(sanitizedFilePath);

        fileStream.on('data', (chunk) => {
          controller.enqueue(chunk);
        });

        fileStream.on('end', () => {
          controller.close();
        });

        fileStream.on('error', (err) => {
          console.error('Error serving file:', err);
          controller.error(err);
        });
      }
    });

    // Replace / or \ with -
    const filename = filePath.replace(/[/\\]/g, '-');

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new Response('Error serving file', {
      status: 500,
    });
  }
};
