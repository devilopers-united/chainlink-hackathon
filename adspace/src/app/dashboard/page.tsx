// src/app/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "../db";
import { createOrUpdateUser, deleteUser } from "../actions";
import { User } from "../db/schema";
import { eq } from "drizzle-orm";

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  const userData = await db.query.User.findFirst({
    where: (users, { eq }) => eq(users.user_id, userId),
    columns: {
      user_id: true,
      created_at: true,
      updated_at: true,
    },
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      {userData ? (
        <div className="mb-4">
          <p>User ID: {userData.user_id}</p>
          <p>Created: {userData.created_at.toLocaleString()}</p>
          <p>Updated: {userData.updated_at.toLocaleString()}</p>
          <form action={deleteUser}>
            <button className="bg-red-500 text-white px-4 py-2 rounded mt-2">
              Delete User Data
            </button>
          </form>
        </div>
      ) : (
        <form action={createOrUpdateUser}>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Save User Data
          </button>
        </form>
      )}
    </main>
  );
}
