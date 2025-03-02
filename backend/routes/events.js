import { Hono } from 'hono';
import { db } from '../db/db.js';
import { calendarEventsTable } from '../schema/calendar_events.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { eq } from "drizzle-orm";

const eventsRoutes = new Hono();

//User is logged in
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

//Modify existing event
eventsRoutes.put('/:id', async (c) => {
  try {
    const user = c.get('user');
    const eventId = parseInt(c.req.param('id'));
    const { title, description, startDateTime, endDateTime, eventType, color, notifyMe } = await c.req.json();

    if (!title || !startDateTime || !endDateTime || !eventType) {
      return c.json({ error: 'Missing required fields'}, 400)
    }

    const [existingEvent] = await db
      .select()
      .from(calendarEventsTable)
      .where(eq(calendarEventsTable.id, eventId))
      .where(eq(calendarEventsTable.createdBy, user.id))
      .execute();
    
    if (!existingEvent) {
      return c.json({ error: 'Event not found'}, 404);
    }

    //Updating the event
    const updatedEvent = await db
      .update(calendarEventsTable)
      .set({
        title,
        description,
        startDateTime: new Date(startDateTime),
        endDateTime: new Date(endDateTime),
        eventType,
        color,
        notifyMe,
      })
      .where(eq(calendarEventsTable.id, eventId))
      .returning();

      console.log("Event updated successfully: ", updatedEvent);
      return c.json({ message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    console.log("Error updating event: ", error);
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
