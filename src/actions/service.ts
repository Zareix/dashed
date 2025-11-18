import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { count, eq } from "drizzle-orm";
import { db } from "~/lib/db";
import { serviceTable } from "~/lib/db/schema";
import { serviceCreateSchema, serviceEditSchema } from "~/lib/schema";
import { tryCatch } from "~/lib/try-catch";

export const service = {
	ping: defineAction({
		input: z.object({ url: z.string().url() }),
		handler: async (input) => {
			const res = await tryCatch(
				fetch(input.url, {
					signal: AbortSignal.timeout(3000),
				}),
			);

			return !res.error && res.data.ok;
		},
	}),
	create: defineAction({
		input: serviceCreateSchema,
		handler: async (input) => {
			const getMaxOrder =
				(
					await db
						.select({ count: count() })
						.from(serviceTable)
						.where(eq(serviceTable.categoryId, input.categoryId))
				)[0]?.count ?? -1;
			const service = await db
				.insert(serviceTable)
				.values({
					...input,
					order: getMaxOrder + 1,
				})
				.returning();

			if (service.length === 0) {
				throw new Error("Failed to create service");
			}

			return service[0];
		},
	}),
	edit: defineAction({
		input: serviceEditSchema,
		handler: async (input) => {
			if (!input.id) {
				throw new Error("Missing id");
			}
			const res = await db
				.update(serviceTable)
				.set(input)
				.where(eq(serviceTable.id, input.id))
				.returning();

			if (res.length === 0) {
				throw new Error("Service not found");
			}

			return res[0];
		},
	}),
	delete: defineAction({
		input: z.object({ id: z.number() }),
		handler: async (input) => {
			await db.delete(serviceTable).where(eq(serviceTable.id, input.id));
		},
	}),
	reorder: defineAction({
		input: z.object({ categoryId: z.number(), order: z.array(z.number()) }),
		handler: async (input) => {
			await db.transaction(async (tx) => {
				await Promise.all(
					input.order.map((id, index) => {
						return tx
							.update(serviceTable)
							.set({ order: index + 1 })
							.where(eq(serviceTable.id, id));
					}),
				);
			});
		},
	}),
};
