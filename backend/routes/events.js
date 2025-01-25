import express from 'express';
import { db } from '../db/db.js';
import { calendarEventsTable } from '../schema/calendar_events.js';


const router = express.Router();

// POST /events: Add a new event
router.post('/events', async (req, res) => {
    try {
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

        // Insert the event into the database
        const newEvent = await db.insert(calendarEventsTable).values({
            title,
            description,
            startDateTime,
            endDateTime,
            eventType,
            color,
            notifyMe,
            createdBy: userId
        }).returning('*');

        res.status(201).json({ event: newEvent });
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
