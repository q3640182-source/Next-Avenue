import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// We fall back to a dummy URL during build if DATABASE_URL is not set
const connectionString = process.env.DATABASE_URL || 'postgresql://dummy:dummy@localhost/dummy';
const sql = neon(connectionString);
export const db = drizzle(sql);
