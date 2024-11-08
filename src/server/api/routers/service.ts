import { TRPCError } from "@trpc/server";
import { count, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { servicesTable } from "~/server/db/schema";
import { refreshIndexPage } from "~/utils/api";

export const serviceRouter = createTRPCRouter({
	create: publicProcedure
		.input(
			z.object({
				id: z.number().optional(),
				name: z.string().min(1),
				url: z.string().url(),
				icon: z.string().min(1),
				categoryName: z.string(),
			}),
		)
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
			refreshIndexPage().catch(console.error);
		}),
	edit: publicProcedure
		.input(
			z.object({
				id: z.number().optional(),
				name: z.string().min(1),
				url: z.string().url(),
				categoryName: z.string(),
				icon: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			if (!input.id) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Missing id",
				});
			}
			await ctx.db
				.update(servicesTable)
				.set(input)
				.where(eq(servicesTable.id, input.id));
			refreshIndexPage().catch(console.error);
		}),
	delete: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.delete(servicesTable).where(eq(servicesTable.id, input.id));
			refreshIndexPage().catch(console.error);
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

			refreshIndexPage().catch(console.error);
		}),
	refresh: publicProcedure.mutation(async () => {
		console.log("Refreshing index page...");
		await refreshIndexPage();
		return { message: "Refreshed index page" };
	}),
});
