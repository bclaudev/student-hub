import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users.js";

export const resourcesTable = pgTable("resources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  filePath: text("file_path").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  uploadedBy: integer("uploaded_by").references(() => usersTable.id).onDelete("cascade"),
});