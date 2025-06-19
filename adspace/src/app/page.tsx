import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <main>
      <h1>Neon + Clerk Example</h1>
      <p>Welcome to the Neon + Clerk example application!</p>
      {userId ? (
        <p className="text-green-500">You are logged in as user ID: {userId}</p>
      ) : (
        <p className="text-red-500">You are not logged in.</p>
      )}
    </main>
  );
}
