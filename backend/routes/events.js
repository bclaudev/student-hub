import express from 'express';
import { db } from '../db/db.js';
import { calendarEventsTable } from '../schema/calendar_events.js';
import { verifyToken  } from '../middleware/authMiddleware.js';

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

export default router;
