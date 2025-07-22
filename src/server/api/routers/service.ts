import { TRPCError } from "@trpc/server";
import { count, eq } from "drizzle-orm";
import { z } from "zod";

import { WIDGETS } from "~/lib/widgets";
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
				alternativeUrls: z
					.array(
						z.object({
							url: z.string().url(),
							name: z.string().min(1),
						}),
					)
					.optional()
					.default([]),
				icon: z.string().min(1),
				categoryName: z.string(),
				openInNewTab: z.boolean(),
				widget: WIDGETS,
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
			refreshIndexPage();
		}),
	edit: publicProcedure
		.input(
			z.object({
				id: z.number().optional(),
				name: z.string().min(1),
				url: z.string().url(),
				alternativeUrls: z
					.array(
						z.object({
							url: z.string().url(),
							name: z.string().min(1),
						}),
					)
					.optional()
					.default([]),
				categoryName: z.string(),
				icon: z.string().min(1),
				openInNewTab: z.boolean(),
				widget: WIDGETS,
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
			refreshIndexPage();
		}),
	delete: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.delete(servicesTable).where(eq(servicesTable.id, input.id));
			refreshIndexPage();
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

			refreshIndexPage();
		}),
	refresh: publicProcedure.mutation(async () => {
		console.log("Refreshing index page...");
		refreshIndexPage();
	}),
	ping: publicProcedure
		.input(z.object({ url: z.string().url() }))
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
