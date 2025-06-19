"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { User } from "./db/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export async function createOrUpdateUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("User not found");

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const externalAccounts = user?.externalAccounts ?? [];
  const githubId =
    externalAccounts.find((acc) => acc.provider === "github")?.externalId ??
    null;

  await db
    .insert(User)
    .values({
      user_id: userId,
    })
    .onConflictDoUpdate({
      target: User.user_id,
      set: {},
    });
}

export async function deleteUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("User not found");

  await db.delete(User).where(eq(User.user_id, userId));
}
