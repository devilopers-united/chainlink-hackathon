import { drizzle } from "drizzle-orm/neon-http";;
import { neon } from "@neondatabase/serverless";;

import * as schema from "./schema";
import * as dotenv from "dotenv";

// Optional, only if needed here
dotenv.config({ path: ".env" });

if (!process.env.DATABASE_URL) {
    throw new Error("Mising DATABASE_URL in environment.")
}

const sql = neon(process.env.DATABASE_URL!)

export const db = drizzle(sql, { schema })

export { sql }
