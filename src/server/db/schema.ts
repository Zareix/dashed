import { relations, sql } from 'drizzle-orm'
import { index, int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const categoryTable = sqliteTable(
  'category',
  {
    name: text('name', { length: 256 }).primaryKey(),
    maxCols: int('max_cols', { mode: 'number' }).notNull().default(sql`5`),
    order: int('order', { mode: 'number' }).notNull().default(sql`0`),
    createdAt: int('created_at', { mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$onUpdate(
      () => new Date(),
    ),
  },
  (category) => ({
    categoryNameIndex: index('category_name_idx').on(category.name),
  }),
)

export const categoriesRelation = relations(categoryTable, ({ many }) => ({
  services: many(servicesTable),
}))

export const servicesTable = sqliteTable(
  'service',
  {
    id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    name: text('name', { length: 256 }).notNull(),
    url: text('url', { length: 256 }).notNull(),
    icon: text('icon', { length: 256 }).notNull(),
    order: int('order', { mode: 'number' }).notNull().default(sql`0`),
    categoryName: text('category_name', { length: 256 }).notNull(),
    createdAt: int('created_at', { mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int('updated_at', { mode: 'timestamp' }).$onUpdate(
      () => new Date(),
    ),
  },
  (service) => ({
    serviceNameIndex: index('service_name_idx').on(service.name),
  }),
)

export const servicesRelations = relations(servicesTable, ({ one }) => ({
  category: one(categoryTable, {
    fields: [servicesTable.categoryName],
    references: [categoryTable.name],
  }),
}))

export type Service = typeof servicesTable.$inferSelect
export type Category = typeof categoryTable.$inferSelect
