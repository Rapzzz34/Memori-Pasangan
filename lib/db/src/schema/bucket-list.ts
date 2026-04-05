import { pgTable, text, boolean, serial, timestamp } from "drizzle-orm/pg-core";

export const bucketListTable = pgTable("bucket_list_items", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type BucketListItem = typeof bucketListTable.$inferSelect;
