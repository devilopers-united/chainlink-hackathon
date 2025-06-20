// src/app/db/schema.ts
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const User = pgTable("user", {
  user_id: text("user_id").primaryKey().notNull(), // Clerk user ID
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
