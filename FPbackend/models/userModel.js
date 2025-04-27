import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { db } from './itemModel.js'; // same db connection
import { eq } from 'drizzle-orm';

// User Table Schema
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull(), // hashed in future
  role: text('role').notNull().default('staff'), // 'admin' or 'staff'
});

// 🔐 Logic for Managing Users

export async function createUser({ username, password, role }) {
  await db.insert(users).values({ username, password, role });
}

export async function getUserByUsername(username) {
  const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
  return result[0] || null;
}

export async function getAllUsers() {
  return await db.select().from(users);
}

export async function deleteUser(id) {
  return await db.delete(users).where(eq(users.id, id));
}
