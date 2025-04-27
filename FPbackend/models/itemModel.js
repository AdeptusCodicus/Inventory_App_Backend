import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { lte } from 'drizzle-orm';

// Handle __dirname with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Connect to SQLite database
const dbPath = path.join(__dirname, '../data/inventory.db');
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite);

// Items Table Schema
export const items = sqliteTable('items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  category: text('category').notNull(), // food, toiletries, etc.
  quantity: integer('quantity').notNull(),
  barcode: text('barcode').unique().notNull(),
  lowStockThreshold: integer('lowStockThreshold').notNull(), // for alerts
  price: real('price').notNull()
});

// Initialize database schema
export function initializeDatabase() {
  // Create the items table if it doesn't exist
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      barcode TEXT UNIQUE NOT NULL,
      lowStockThreshold INTEGER NOT NULL,
      price REAL NOT NULL
    )
  `);
  console.log('Database schema initialized');
}

// Call initializeDatabase when this module is imported
initializeDatabase();

// 🔧 Item Logic Functions
export async function addItem({ name, category, quantity, barcode, lowStockThreshold, price }) {
  await db.insert(items).values({ name, category, quantity, barcode, lowStockThreshold, price });
}

// Add this to your itemModel.js
export async function getAllItems() {
  try {
    console.log('Attempting to fetch all items...');
    const result = await db.select().from(items);
    console.log('Items fetched successfully:', result);
    return result;
  } catch (error) {
    console.error('Error in getAllItems:', error);
    throw error; // Re-throw to be caught by the controller
  }
}

export async function getItemByBarcode(barcode) {
  const result = await db.select().from(items).where(eq(items.barcode, barcode));
  return result[0] || null;
}

export async function updateItemQuantity(barcode, newQuantity) {
  return await db.update(items)
    .set({ quantity: newQuantity })
    .where(eq(items.barcode, barcode));
}

export async function deleteItem(barcode) {
  return await db.delete(items).where(eq(items.barcode, barcode));
}

export async function searchItems(searchTerm) {
  return await db.select().from(items).where(items.name.like(`%${searchTerm}%`));
}

export async function getLowStockItems() {
  try {
    return await db.select().from(items).where(lte(items.quantity, items.lowStockThreshold));
  } catch (error) {
    console.error('Error in getLowStockItems:', error);
    throw error; // Re-throw to be caught by the controller
  }
}

