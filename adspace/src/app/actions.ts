// src/app/actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { User } from "./db/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export async function createOrUpdateUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("User not found");

  await db
    .insert(User)
    .values({
      user_id: userId,
      updated_at: new Date(),
    })
    .onConflictDoUpdate({
      target: User.user_id,
      set: {
        updated_at: new Date(),
      },
    });
}

export async function deleteUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("User not found");

  await db.delete(User).where(eq(User.user_id, userId));
}
