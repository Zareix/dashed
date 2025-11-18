import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { asc, eq } from "drizzle-orm";
import { db } from "~/lib/db";
import { categoryTable, serviceTable } from "~/lib/db/schema";

export const category = {
	getAllWithServices: defineAction({
		handler: async () => {
			return db.query.categoryTable.findMany({
				with: {
					services: {
						orderBy: (service) => [asc(service.order)],
					},
				},
				orderBy: (category) => [asc(category.order)],
			});
		},
	}),
	getAll: defineAction({
		handler: async () => {
			return await db.query.categoryTable.findMany({
				orderBy: (category) => [asc(category.order)],
			});
		},
	}),
	reorder: defineAction({
		input: z.object({ order: z.array(z.number()) }),
		handler: async (input) => {
			await db.transaction(async (tx) => {
				await Promise.all(
					input.order.map((id, index) => {
						return tx
							.update(categoryTable)
							.set({ order: index + 1 })
							.where(eq(categoryTable.id, id));
					}),
				);
			});
		},
	}),
	create: defineAction({
		input: z.object({
			name: z.string().min(1),
			maxCols: z.number().min(1).max(5),
		}),
		handler: async (input) => {
			await db.insert(categoryTable).values(input);
		},
	}),
	edit: defineAction({
		input: z.object({
			id: z.number(),
			name: z.string().min(1),
			maxCols: z.number().min(1).max(5),
		}),
		handler: async (input) => {
			const updated = await db
				.update(categoryTable)
				.set({
					name: input.name,
					maxCols: input.maxCols,
				})
				.where(eq(categoryTable.id, input.id))
				.returning();

			return updated[0];
		},
	}),
	delete: defineAction({
		input: z.object({ id: z.number() }),
		handler: async (input) => {
			await db
				.delete(serviceTable)
				.where(eq(serviceTable.categoryId, input.id));
			await db.delete(categoryTable).where(eq(categoryTable.id, input.id));
		},
	}),
};
