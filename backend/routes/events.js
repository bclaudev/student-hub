import express from 'express';
import { db } from '../db/db.js';
import { calendarEventsTable } from '../schema/calendar_events.js';
import { verifyToken  } from '../middleware/authMiddleware.js';
import { eq, and } from "drizzle-orm";


const router = express.Router();

// POST /events: Add a new event
router.post('/events', verifyToken, async (req, res) => {
    try {
        console.log('Request Body:', req.body); // Log the request body
        console.log('User ID:', req.user?.id);  // Log the authenticated user's ID
        const {
            title,
            description,
            startDateTime,
            endDateTime,
            eventType,
            color,
            notifyMe
        } = req.body;

        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Validate required fields
        if (!title || !startDateTime || !endDateTime || !eventType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Convert strings to Date objects
        const startDate = new Date(startDateTime);
        const endDate = new Date(endDateTime);

        // Attempt to insert the event into the database
        const newEvent = await db.insert(calendarEventsTable).values({
            title,
            description,
            startDateTime: startDate,
            endDateTime: endDate,
            eventType,
            color,
            notifyMe,
            createdBy: userId
        }).returning({
            id: calendarEventsTable.id,
            title: calendarEventsTable.title,
            startDateTime: calendarEventsTable.startDateTime,
            endDateTime: calendarEventsTable.endDateTime,
          });

        res.status(201).json({ event: newEvent });
    } catch (error) {
        console.error('Error adding event:', error); // Log detailed error to the console
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/events', verifyToken, async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Fetch events for the authenticated user
        const events = await db
        .select()
        .from(calendarEventsTable)
        .where(eq(calendarEventsTable.createdBy, userId))
        .execute();

        res.status(200).json({ events });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/events/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.user?.id; // Authenticated user's ID
        const { id } = req.params; // Event ID from the route parameter

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Check if the event exists and belongs to the user
        const event = await db
            .select()
            .from(calendarEventsTable)
            .where(and(eq(calendarEventsTable.id, id), eq(calendarEventsTable.createdBy, userId)))
            .execute();

        if (event.length === 0) {
            return res.status(404).json({ error: 'Event not found or unauthorized' });
        }

        // Delete the event
        await db
            .delete(calendarEventsTable)
            .where(eq(calendarEventsTable.id, id))
            .execute();

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/events/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.user?.id; // Authenticated user's ID
        const { id } = req.params; // Event ID from the route parameter
        const {
            title,
            description,
            startDateTime,
            endDateTime,
            eventType,
            color,
            notifyMe,
        } = req.body; // Updated event data

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Check if the event exists and belongs to the user
        const event = await db
            .select()
            .from(calendarEventsTable)
            .where(and(eq(calendarEventsTable.id, id), eq(calendarEventsTable.createdBy, userId)))
            .execute();

        if (event.length === 0) {
            return res.status(404).json({ error: 'Event not found or unauthorized' });
        }

        // Validate required fields
        if (!title || !startDateTime || !endDateTime || !eventType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Convert start and end times to Date objects
        const updatedStartDate = new Date(startDateTime);
        const updatedEndDate = new Date(endDateTime);

        // Update the event in the database
        const updatedEvent = await db
            .update(calendarEventsTable)
            .set({
                title,
                description,
                startDateTime: updatedStartDate,
                endDateTime: updatedEndDate,
                eventType,
                color,
                notifyMe,
            })
            .where(and(eq(calendarEventsTable.id, id), eq(calendarEventsTable.createdBy, userId)))
            .returning({
                id: calendarEventsTable.id,
                title: calendarEventsTable.title,
                description: calendarEventsTable.description,
                startDateTime: calendarEventsTable.startDateTime,
                endDateTime: calendarEventsTable.endDateTime,
                eventType: calendarEventsTable.eventType,
                color: calendarEventsTable.color,
                notifyMe: calendarEventsTable.notifyMe,
                createdBy: calendarEventsTable.createdBy,
            })
            .execute();

        res.status(200).json({ event: updatedEvent });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
