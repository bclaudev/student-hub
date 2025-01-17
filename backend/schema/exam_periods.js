import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";
import { classesTable } from "./classes.js";

export const examPeriodsTable = pgTable("exam_periods", {
    id: serial("id").primaryKey(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    classId: integer("class_id").references(() => classesTable).onDelete("cascade"),
    userId: integer("user_id").references(() => usersTable.id).onDelete("cascade")
  });