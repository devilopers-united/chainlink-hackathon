// src/app/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "../db";
import { createOrUpdateUser, deleteUser } from "../actions";

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  const userData = await db.query.User.findFirst({
    where: (users, { eq }) => eq(users.user_id, userId),
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      {userData ? (
        <div className="mb-4">
          
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
