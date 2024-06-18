// src/routes/api/download/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { join } from 'path';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';

const isDev = process.env.NODE_ENV === 'development';
const dataDir = isDev ? 'C:\\Users\\Logan\\Pictures\\photo-share' : '/data';

export const POST: RequestHandler = async ({ request }) => {
  const formData = await request.formData();
  const filePath = formData.get('filePath') as string;

  if (!filePath) {
    return new Response('Missing file path', {
      status: 400,
    });
  }

  const fullPath = join(dataDir, filePath);

  try {
    const fileStat = await stat(fullPath);
    if (!fileStat.isFile()) {
      return new Response('Not a valid file', {
        status: 400,
      });
    }

    const stream = new ReadableStream({
      start(controller) {
        const fileStream = createReadStream(fullPath);

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

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filePath.split('/').pop()}"`,
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new Response('Error serving file', {
      status: 500,
    });
  }
};
