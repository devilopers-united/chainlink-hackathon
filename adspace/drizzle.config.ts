import * as dotenv from "dotenv"
import { defineConfig } from "drizzle-kit"

dotenv.config({
    path: ".env"
})

if (!process.env.DATABASE_URL) {
    throw new Error("Database url is not set in .env");
}

export default defineConfig({
    out: "./src/drizzle",
    schema: "./src/lib/db/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
    migrations: {
        table: "___drizzle_migration",
        schema: "public"
    },
    verbose: true,
    strict: true,
    
});