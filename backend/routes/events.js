import { Elysia } from 'elysia';
import { db } from '../db/db.js';
import { calendarEventsTable } from '../schema/calendar_events.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { eq, and } from "drizzle-orm";

const eventsRoutes = new Elysia()
  .onRequest(verifyToken)
  .post('/events', async ({ body, user, set }) => {
    try {
      const { title, description, startDateTime, endDateTime, eventType, color, notifyMe } = body;
      const userId = user.id;

      if (!title || !startDateTime || !endDateTime || !eventType) {
        set.status = 400;
        return { error: 'Missing required fields' };
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

      return { event: newEvent };
    } catch (error) {
      set.status = 500;
      return { error: 'Internal server error' };
    }
  })
  .get('/events', async ({ user, set }) => {
    try {
      const events = await db.select().from(calendarEventsTable).where(eq(calendarEventsTable.createdBy, user.id)).execute();
      return { events };
    } catch (error) {
      set.status = 500;
      return { error: 'Internal server error' };
    }
  });

export default eventsRoutes; // ✅ Ensure this returns an instance of Elysia
