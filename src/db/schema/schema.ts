import { mysqlTable, varchar, text, int, timestamp, mysqlEnum } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { user } from './auth-schema';

// --- URLS TABLE ---
export const urls = mysqlTable('urls', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => createId()),
  userId: varchar('user_id', { length: 36 }).notNull(),
  originalUrl: text('original_url').notNull(),
  shortCode: varchar('short_code', { length: 50 }).notNull().unique(),
  title: varchar('title', { length: 255 }),
  ogTitle: varchar('og_title', { length: 255 }),
  ogDescription: text('og_description'),
  ogImage: text('og_image'),
  clicks: int('clicks').default(0).notNull(),
  status: mysqlEnum('status', ['Active', 'Archived']).default('Active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

// --- CLICKS (ANALYTICS) TABLE ---
export const clicks = mysqlTable('clicks', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => createId()),
  urlId: varchar('url_id', { length: 255 }).notNull(),
  device: varchar('device', { length: 100 }),
  browser: varchar('browser', { length: 100 }),
  ip: varchar('ip', { length: 50 }),
  location: varchar('location', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// --- SETTINGS TABLE ---
export const settings = mysqlTable('settings', {
  id: varchar('id', { length: 255 }).primaryKey().$defaultFn(() => createId()),
  userId: varchar('user_id', { length: 36 }).notNull(),
  key: varchar('key', { length: 100 }).notNull(),
  value: text('value'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

// --- RELATIONS ---
export const urlsRelations = relations(urls, ({ one, many }) => ({
  user: one(user, {
    fields: [urls.userId],
    references: [user.id],
  }),
  clicks: many(clicks),
}));

export const clicksRelations = relations(clicks, ({ one }) => ({
  url: one(urls, {
    fields: [clicks.urlId],
    references: [urls.id],
  }),
}));

export const settingsRelations = relations(settings, ({ one }) => ({
  user: one(user, {
    fields: [settings.userId],
    references: [user.id],
  }),
}));
