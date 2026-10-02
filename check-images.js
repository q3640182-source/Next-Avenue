import { neon } from "@neondatabase/serverless";
import fs from "fs";

const envFile = fs.readFileSync(".env.local", "utf8");
const dbUrlMatch = envFile.match(/DATABASE_URL=(.*)/);
const realDbUrl = dbUrlMatch ? dbUrlMatch[1].trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '') : "";

const sql = neon(realDbUrl);

async function check() {
  const res = await sql`SELECT title, images FROM listings WHERE sector = 'F-11'`;
  console.log(JSON.stringify(res, null, 2));
}

check().catch(console.error);
