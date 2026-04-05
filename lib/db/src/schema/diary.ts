import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

export const diaryTable = pgTable("diary_entries", {
  id: serial("id").primaryKey(),
  content: text("content").notNull().default(""),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type DiaryEntry = typeof diaryTable.$inferSelect;
