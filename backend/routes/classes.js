// classes.js
import { Hono } from 'hono';
import { db } from '../db/db.js';
import { classesTable } from '../schema/classes.js';
import { calendarEventsTable } from '../schema/calendar_events.js';

// Utility to combine date + time strings into a JS Date object
function combineDateAndTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;
  const dateObj = new Date(dateStr);
  const [hours, minutes, seconds = '0'] = timeStr.split(':');
  dateObj.setHours(+hours, +minutes, +seconds);
  return dateObj;
}

export const classesRoute = new Hono();

classesRoute.post('/', async (c) => {
  try {
    // 1) Check if user is logged in
    const user = c.get('user');
    if (!user) {
      return c.json({ success: false, error: "Not logged in" }, 401);
    }

    // 2) Destructure fields (including `curriculum`)
    const {
      name,
      teacherName,
      curriculum,
      examDate,
      startDate,
      startTime,
      endTime,
      recurrence,
    } = await c.req.json();

    // 3) Insert into 'classes' table
    const [newClass] = await db.insert(classesTable).values({
      // required fields
      name,
      teacherName,
      createdBy: user.id,

      // optional fields, if you want them
      curriculum,
      examDate: examDate ? new Date(examDate) : null,
      recurrence,

      // date/time columns
      startDate: startDate ? new Date(startDate) : null,
      startTime,
      endTime,
    }).returning();

    // 4) Insert a matching calendar event (if you want to keep track in 'calendar_events')
    const startDateTime = combineDateAndTime(startDate, startTime);
    const endDateTime = combineDateAndTime(startDate, endTime);

    const [newEvent] = await db.insert(calendarEventsTable).values({
      title: name,
      startDateTime,
      endDateTime,
      eventType: 'class',
      createdBy: user.id,
      color: "#81C784",
      additionalInfo: { classId: newClass.id },
    }).returning();

    // 5) Optionally compute day-of-week for the timetable
    let dayString = null;
    if (startDateTime) {
      const dayIndex = startDateTime.getDay(); // 0=Sunday..6=Saturday
      const dayLabels = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
      dayString = dayLabels[dayIndex];
    }

    // 6) Return the new class in the shape the frontend Timetable expects
    return c.json({
      success: true,
      class: {
        id: newClass.id,
        subject: newClass.name,          // rename as needed
        professor: newClass.teacherName, // or keep 'teacherName'
        day: dayString,
        startTime: newClass.startTime,
        endTime: newClass.endTime,
        color: "bg-blue-100 border-blue-300",

        // If your Timetable needs to see 'curriculum' too, you can return it:
        curriculum: newClass.curriculum,
      },
      event: newEvent,
    });
  } catch (error) {
    console.error("Error inserting class/event:", error);
    return c.json({ success: false, error: error.message }, 400);
  }
});

// Optionally, GET /api/classes to fetch them
classesRoute.get('/', async (c) => {
  try {
    const dbClasses = await db.select().from(classesTable);
    // Transform each class to include the computed "day" field
    const transformed = dbClasses.map(cls => {
      let dayString = null;
      if (cls.startDate && cls.startTime) {
        const dateObj = new Date(cls.startDate);
        const [hours, minutes] = cls.startTime.split(':').map(Number);
        dateObj.setHours(hours, minutes);
        const dayIndex = dateObj.getDay(); // 0=Sun..6=Sat
        const dayLabels = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
        dayString = dayLabels[dayIndex];
      }
      return { ...cls, day: dayString };
    });
    return c.json({ success: true, classes: transformed });
  } catch (error) {
    return c.json({ success: false, error: error.message }, 500);
  }
});