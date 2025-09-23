import { relations, sql } from "drizzle-orm";
import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { WIDGETS } from "~/lib/widgets";

export const categoryTable = sqliteTable(
	"category",
	{
		name: text("name", { length: 256 }).primaryKey(),
		maxCols: int("max_cols", { mode: "number" }).notNull().default(sql`5`),
		order: int("order", { mode: "number" }).notNull().default(sql`0`),
		createdAt: int("created_at", { mode: "timestamp" })
			.default(sql`(unixepoch())`)
			.notNull(),
		updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
			() => new Date(),
		),
	},
	(category) => [index("category_name_idx").on(category.name)],
);

export const categoriesRelation = relations(categoryTable, ({ many }) => ({
	services: many(servicesTable),
}));

export const servicesTable = sqliteTable(
	"service",
	{
		id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
		name: text("name", { length: 256 }).notNull(),
		url: text("url", { length: 256 }).notNull(),
		alternativeUrls: text("alternative_urls", {
			mode: "json",
		})
			.default(sql`[]`)
			.$type<Array<AlternativeUrl>>()
			.notNull(),
		icon: text("icon", { length: 256 }).notNull(),
		iconDark: text("icon_dark", { length: 256 }),
		order: int("order", { mode: "number" }).notNull().default(sql`0`),
		widget: text("widget", { mode: "json" })
			.default(sql`'{"type":"none","config":{}}'`)
			.$type<WIDGETS>()
			.notNull(),
		openInNewTab: int("open_in_new_tab", { mode: "boolean" })
			.notNull()
			.default(sql`0`),
		categoryName: text("category_name", { length: 256 })
			.references(() => categoryTable.name, {
				onDelete: "cascade",
			})
			.notNull(),
		createdAt: int("created_at", { mode: "timestamp" })
			.default(sql`(unixepoch())`)
			.notNull(),
		updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
			() => new Date(),
		),
	},
	(service) => [index("service_name_idx").on(service.name)],
);

export const servicesRelations = relations(servicesTable, ({ one }) => ({
	category: one(categoryTable, {
		fields: [servicesTable.categoryName],
		references: [categoryTable.name],
	}),
}));

export type AlternativeUrl = {
	url: string;
	name: string;
};

export type Service = Omit<
	typeof servicesTable.$inferSelect,
	"widget" | "alternativeUrls"
> & {
	widget: WIDGETS;
	alternativeUrls: Array<AlternativeUrl>;
};
export type Category = typeof categoryTable.$inferSelect;
