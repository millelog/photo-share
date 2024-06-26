//routes/api/data/+server.ts
import { error } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import { PUBLIC_DEV_DATA_DIR, PUBLIC_PROD_DATA_DIR } from '$env/static/public';

const isDev = process.env.NODE_ENV === 'development';
const dataDir = isDev ? PUBLIC_DEV_DATA_DIR : PUBLIC_PROD_DATA_DIR;

export async function GET({ url }: { url: URL }): Promise<Response> {
	if (!dataDir) throw new Error('Data directory not set');

	try {
		const filePath = url.searchParams.get('path');

		if (filePath) {
			const absolutePath = path.join(dataDir, filePath);

			if (!fs.existsSync(absolutePath)) {
				throw error(404, 'File not found');
			}

			const fileContent = fs.readFileSync(absolutePath);
			const contentType = getContentType(absolutePath);

			return new Response(fileContent, {
				status: 200,
				headers: {
					'Content-Type': contentType
				}
			});
		} else {
			throw error(400, 'Missing file path');
		}
	} catch (err) {
		console.error(err);

		if (err instanceof Error && err.name === 'NotFoundError') {
			throw error(404, 'File not found');
		} else {
			throw error(500, 'Internal Server Error');
		}
	}
}

function getContentType(filePath: string): string {
	const extension = path.extname(filePath).toLowerCase();

	switch (extension) {
		case '.jpg':
		case '.jpeg':
			return 'image/jpeg';
		case '.png':
			return 'image/png';
		case '.gif':
			return 'image/gif';
		case '.mp4':
			return 'video/mp4';
		case '.avi':
			return 'video/x-msvideo';
		case '.mov':
			return 'video/quicktime';
		default:
			return 'application/octet-stream';
	}
}
