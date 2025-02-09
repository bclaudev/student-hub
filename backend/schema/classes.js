  import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
  import { usersTable } from "./users.js";

  export const classesTable = pgTable("classes", {
      id: serial("id").primaryKey(),
      name: text("name").notNull(),
      teacherName: text("teacher_name"),
      examDate: timestamp("exam_date"),
      curriculum: text("curriculum"),
      createdBy: integer("created_by").references(() => usersTable.id, { onDelete: "cascade" }),
    });