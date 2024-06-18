// routes/api/downloadSelected/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { resolve } from 'path';
import archiver from 'archiver';

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
  const folder = formData.get('folder') as string;
  const filePathsString = formData.get('filePaths') as string;

  if (!folder || !filePathsString) {
    return new Response('Missing folder or file paths', {
      status: 400,
    });
  }

  const filePaths = filePathsString.split(',').map((filePath) => filePath.trim());

  const archive = archiver('zip', {
    zlib: { level: 9 },
  });

  let archiveFinished = false;

  const stream = new ReadableStream({
    start(controller) {
      archive.on('data', (data) => {
        controller.enqueue(data);
      });

      archive.on('end', () => {
        archiveFinished = true;
        controller.close();
      });

      archive.on('error', (err) => {
        console.error('Error creating zip archive:', err);
        controller.error(err);
      });
    },
    cancel() {
      if (!archiveFinished) {
        archive.abort();
      }
    }
  });

  for (const filePath of filePaths) {
    const sanitizedFilePath = sanitizeFilePath(filePath);
    if (sanitizedFilePath) {
      archive.file(sanitizedFilePath, { name: filePath });
    }
  }

  archive.finalize();

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${folder}.zip"`,
    },
  });
};
