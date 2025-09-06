import { TRPCError } from "@trpc/server";
import { count, eq } from "drizzle-orm";
import { z } from "zod";
import { serviceCreateSchema, serviceEditSchema } from "~/lib/schemas";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { servicesTable } from "~/server/db/schema";
import { refreshIndexPage } from "~/server/lib";

export const serviceRouter = createTRPCRouter({
	create: publicProcedure
		.input(serviceCreateSchema)
		.mutation(async ({ ctx, input }) => {
			const getMaxOrder =
				(
					await ctx.db
						.select({ count: count() })
						.from(servicesTable)
						.where(eq(servicesTable.categoryName, input.categoryName))
				)[0]?.count ?? -1;
			await ctx.db.insert(servicesTable).values({
				...input,
				order: getMaxOrder + 1,
			});
			await refreshIndexPage();
		}),
	edit: publicProcedure
		.input(serviceEditSchema)
		.mutation(async ({ ctx, input }) => {
			if (!input.id) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Missing id",
				});
			}
			const res = await ctx.db
				.update(servicesTable)
				.set(input)
				.where(eq(servicesTable.id, input.id))
				.returning();
			await refreshIndexPage();

			return res[0];
		}),
	delete: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.delete(servicesTable).where(eq(servicesTable.id, input.id));
			await refreshIndexPage();
		}),
	reorder: publicProcedure
		.input(z.object({ categoryName: z.string(), order: z.array(z.number()) }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.transaction(async (tx) => {
				await Promise.all(
					input.order.map((id, index) => {
						return tx
							.update(servicesTable)
							.set({ order: index + 1 })
							.where(eq(servicesTable.id, id));
					}),
				);
			});

			await refreshIndexPage();
		}),
	refresh: publicProcedure.mutation(async () => {
		await refreshIndexPage();
	}),
	ping: publicProcedure
		.input(z.object({ url: z.url() }))
		.query(async ({ input }) => {
			try {
				const res = await fetch(input.url, {
					signal: AbortSignal.timeout(3000),
				});
				return res.ok;
			} catch {
				return false;
			}
		}),
});
