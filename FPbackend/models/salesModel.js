import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';
import { db, items } from './itemModel.js'; // reuse same db instance
import { eq } from 'drizzle-orm';
import { and, sql } from 'drizzle-orm';

// Sales Table Schema
export const sales = sqliteTable('sales', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  itemBarcode: text('itemBarcode').notNull(),  // Foreign key ref
  quantity: integer('quantity').notNull(),
  type: text('type').notNull(), // 'in' or 'out'
  timestamp: text('timestamp').default(new Date().toISOString()),
});

// 🔧 Sales Logic Functions

export async function recordSale({ itemBarcode, quantity, type }) {
  const timestamp = new Date().toISOString();
  await db.insert(sales).values({ itemBarcode, quantity, type, timestamp });
}

export async function getSales() {
  return await db.select().from(sales);
}

export async function getSalesByType(type) {
  return await db.select().from(sales).where(eq(sales.type, type));
}

export async function getSalesByItem(barcode) {
  return await db.select().from(sales).where(eq(sales.itemBarcode, barcode));
}

export async function getRecentSales(limit = 10) {
  return await db.select().from(sales).orderBy(sales.timestamp).limit(limit);
}

export async function getSalesByDateRange(from, to) {
  return await db
    .select()
    .from(sales)
    .where(
      and(
        sql`${sales.timestamp} >= ${from}`,
        sql`${sales.timestamp} <= ${to}`
      )
    );
}

export async function getSalesGroupedByItemAndType() {
  return await db
    .select({
      item: sales.itemBarcode,
      type: sales.type,
      totalQuantity: sql`SUM(${sales.quantity})`.as('total_quantity'),
    })
    .from(sales)
    .groupBy(sales.itemBarcode, sales.type);
}

export async function getSalesGroupedByItemName() {
  return await db
    .select({
      name: items.name,
      type: sales.type,
      totalQuantity: sql`SUM(${sales.quantity})`.as('total_quantity'),
    })
    .from(sales)
    .innerJoin(items, eq(sales.itemBarcode, items.barcode))
    .groupBy(items.name, sales.type);
}

export async function getSalesGroupedByCategory() {
  return await db
    .select({
      category: items.category,
      type: sales.type,
      totalQuantity: sql`SUM(${sales.quantity})`.as('total_quantity'),
    })
    .from(sales)
    .innerJoin(items, eq(sales.itemBarcode, items.barcode))
    .groupBy(items.category, sales.type);
}

export async function getSalesTotalsByType() {
  return await db
    .select({
      type: sales.type,
      totalQuantity: sql`SUM(${sales.quantity})`.as('total_quantity'),
    })
    .from(sales)
    .groupBy(sales.type);
}
