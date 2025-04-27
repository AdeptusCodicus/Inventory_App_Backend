import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema.js'; // You'll create this next

// Load DB path from .env
import dotenv from 'dotenv';
dotenv.config();

const sqlite = new Database(process.env.DB_PATH || './data/inventory.db');
const db = drizzle(sqlite, { schema });

// Optional: run migrations (if you ever add them)
migrate(db, { migrationsFolder: './migrations' }); // You can skip this line for now if not using migrations

export { db };
