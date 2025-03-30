import { Hono } from 'hono';
import { db } from '../db/db.js';
import { resourcesTable } from '../schema/resources.js';
import { eq } from 'drizzle-orm';
import { verifyToken } from '../middleware/authMiddleware.js';

const resourcesRoute = new Hono();

resourcesRoute.use('*', verifyToken);

resourcesRoute.get('/', async (c) => {
  const userId = c.get('user').id; // Replace this with actual logged-in user ID

  const resources = await db
    .select()
    .from(resourcesTable)
    .where(eq(resourcesTable.uploadedBy, userId));

  return c.json(resources);
});

export default resourcesRoute;
