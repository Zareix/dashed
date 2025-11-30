import { relations, sql } from "drizzle-orm";
import { index, int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { WIDGETS } from "~/lib/widgets";

export const categoryTable = sqliteTable("category", {
	id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
	name: text("name", { length: 256 }).notNull(),
	maxCols: int("max_cols", { mode: "number" }).notNull().default(sql`5`),
	order: int("order", { mode: "number" }).notNull().default(sql`0`),
	createdAt: int("created_at", { mode: "timestamp" })
		.default(sql`(unixepoch())`)
		.notNull(),
	updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
		() => new Date(),
	),
});

export const categoriesRelation = relations(categoryTable, ({ many }) => ({
	services: many(serviceTable),
}));

export const serviceTable = sqliteTable(
	"service",
	{
		id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
		name: text("name", { length: 256 }).notNull(),
		url: text("url", { length: 256 }).notNull(),
		pingUrl: text("ping_url", { length: 256 }),
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
		categoryId: int("category_id", { mode: "number" })
			.references(() => categoryTable.id, {
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

export const servicesRelations = relations(serviceTable, ({ one }) => ({
	category: one(categoryTable, {
		fields: [serviceTable.categoryId],
		references: [categoryTable.id],
	}),
}));

export type AlternativeUrl = {
	url: string;
	name: string;
};
export type Service = typeof serviceTable.$inferSelect;
export type Category = typeof categoryTable.$inferSelect;
