import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

export const songsTable = pgTable("songs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist").notNull().default(""),
  audioUrl: text("audio_url"),
  person: text("person").notNull().default("both"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Song = typeof songsTable.$inferSelect;
