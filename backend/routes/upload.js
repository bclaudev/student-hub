import { Hono } from 'hono';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

// Define __dirname correctly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// uploads directory
const uploadDir = path.resolve(__dirname, '../../uploads');

// Helper function to save file
async function saveFile(file, filename) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(path.join(uploadDir, filename), buffer);
}

const uploadRoute = new Hono();

uploadRoute.post('/', async (c) => {
  const body = await c.req.parseBody();
  const file = body['file'];

  if (!file) {
    return c.json({ error: 'No file uploaded' }, 400);
  }

  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/\s+/g, '_');
  const filename = `${timestamp}_${sanitizedName}`;

  try {
    await saveFile(file, filename);

    return c.json({
      url: `/uploads/${filename}`,
      name: filename,
      originalName: file.name,
      size: file.size,
    });
  } catch (err) {
    console.error("File save error:", err);
    return c.json({ error: 'Error saving file' }, 500);
  }
});

export default uploadRoute;
