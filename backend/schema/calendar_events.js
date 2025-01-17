import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";
import { classesTable } from "./classes.js";

export const calendarEventsTable = pgTable("calendar_events", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    eventDate: date("event_date").notNull(),
    linkedClass: integer("linked_class").references(() => classesTable.id).onDelete("cascade"),
    linkedResource: integer("linked_resource").references(() => resourcesTable.id).onDelete("cascade"),
    createdBy: integer("created_by").references(() => usersTable.id).onDelete("cascade")
  });