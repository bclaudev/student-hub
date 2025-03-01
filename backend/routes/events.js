import { Hono } from 'hono';
import { db } from '../db/db.js';
import { calendarEventsTable } from '../schema/calendar_events.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { eq } from "drizzle-orm";

const eventsRoutes = new Hono();

//Ensure user is authenticated for all event routes
eventsRoutes.use('*', verifyToken);

//Create event
eventsRoutes.post('/', async (c) => {
  try {
    const { title, description, startDateTime, endDateTime, eventType, color, notifyMe } = await c.req.json();
    const userId = c.get('user').id;

    if (!title || !startDateTime || !endDateTime || !eventType) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const newEvent = await db.insert(calendarEventsTable).values({
      title,
      description,
      startDateTime: new Date(startDateTime),
      endDateTime: new Date(endDateTime),
      eventType,
      color,
      notifyMe,
      createdBy: userId
    }).returning();

    return c.json({ event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

//Get user's events
eventsRoutes.get('/', async (c) => {
  try {
    const userId = c.get('user').id;
    const events = await db.select().from(calendarEventsTable).where(eq(calendarEventsTable.createdBy, userId)).execute();
    return c.json({ events });
  } catch (error) {
    console.error("Error retrieving events:", error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default eventsRoutes;
