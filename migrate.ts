import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./lib/db";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Creating site_settings table...");
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        address TEXT NOT NULL DEFAULT '',
        phone VARCHAR(50) NOT NULL DEFAULT '',
        email VARCHAR(255) NOT NULL DEFAULT '',
        facebook VARCHAR(255) NOT NULL DEFAULT '',
        twitter VARCHAR(255) NOT NULL DEFAULT '',
        instagram VARCHAR(255) NOT NULL DEFAULT '',
        linkedin VARCHAR(255) NOT NULL DEFAULT '',
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log("Table created successfully!");
  } catch (error) {
    console.error("Error creating table:", error);
  }
}

main().then(() => process.exit(0)).catch(() => process.exit(1));
