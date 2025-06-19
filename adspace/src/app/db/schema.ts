// src/app/db/schema.ts
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const User = pgTable("user", {
  user_id: text("user_id").primaryKey().notNull(), // Clerk user ID
  github_id: text("github_id"), // GitHub OAuth ID

  created_at: timestamp("created_at").defaultNow().notNull(),
});
