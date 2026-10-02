import { neon } from "@neondatabase/serverless";
import fs from "fs";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./db/schema.js";

const envFile = fs.readFileSync(".env.local", "utf8");
const dbUrlMatch = envFile.match(/DATABASE_URL=(.*)/);
const realDbUrl = dbUrlMatch ? dbUrlMatch[1].trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '') : "";

const sql = neon(realDbUrl);
const db = drizzle(sql, { schema });

async function check() {
  const listings = await db.query.listings.findMany({
    where: (listings, { eq }) => eq(listings.sector, "F-11"),
  });
  const images = listings[0].images;
  console.log("Type:", typeof images);
  console.log("IsArray:", Array.isArray(images));
  console.log("Value:", images);
  if (Array.isArray(images)) {
    console.log("First element:", images[0]);
  } else if (typeof images === "string") {
    console.log("First char:", images[0]);
  }
}
check().catch(console.error);
