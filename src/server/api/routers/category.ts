import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import type { WIDGETS } from "~/lib/widgets";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { categoryTable, servicesTable } from "~/server/db/schema";
import { refreshIndexPage } from "~/utils/api";

import yaml from "js-yaml";

const exportSchema = z.array(
	z.object({
		name: z.string().min(1),
		maxCols: z.number().min(1).max(5),
		order: z.number(),
		services: z.array(
			z.object({
				name: z.string().min(1),
				url: z.string().min(1),
				icon: z.string().min(1),
				order: z.number(),
				openInNewTab: z.boolean(),
			}),
		),
	}),
);

type ExportType = z.infer<typeof exportSchema>;

export const categoryRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		return (
			await ctx.db.query.categoryTable.findMany({
				with: {
					services: {
						orderBy: [asc(servicesTable.order)],
					},
				},
				orderBy: [asc(categoryTable.order)],
			})
		).map((category) => ({
			...category,
			services: category.services.map((service) => ({
				...service,
				widget: service.widget as WIDGETS,
			})),
		}));
	}),
	create: publicProcedure
		.input(
			z.object({
				name: z.string().min(1),
				maxCols: z.number().min(1).max(5),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.db.insert(categoryTable).values(input);
			refreshIndexPage();
		}),
	edit: publicProcedure
		.input(
			z.object({
				name: z.string().min(1),
				maxCols: z.number().min(1).max(5),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.db
				.update(categoryTable)
				.set(input)
				.where(eq(categoryTable.name, input.name));
			refreshIndexPage();
		}),
	delete: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
		await ctx.db.delete(categoryTable).where(eq(categoryTable.name, input));
		refreshIndexPage();
	}),
	reorder: publicProcedure
		.input(z.object({ order: z.array(z.string()) }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.transaction(async (tx) => {
				await Promise.all(
					input.order.map((name, index) => {
						return tx
							.update(categoryTable)
							.set({ order: index + 1 })
							.where(eq(categoryTable.name, name));
					}),
				);
			});

			refreshIndexPage();
		}),
	export: publicProcedure.mutation(async ({ ctx }) => {
		const categories = await ctx.db.query.categoryTable.findMany({
			columns: {
				name: true,
				maxCols: true,
				order: true,
			},
			with: {
				services: {
					columns: {
						name: true,
						url: true,
						icon: true,
						order: true,
						openInNewTab: true,
					},
					orderBy: [asc(servicesTable.order)],
				},
			},
			orderBy: [asc(categoryTable.order)],
		});
		return categories satisfies ExportType;
	}),
	import: publicProcedure
		.input(
			z.object({
				type: z.enum(["dashed", "homepage"]),
				data: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			switch (input.type) {
				case "dashed": {
					const parsed = exportSchema.parse(JSON.parse(input.data));
					for (const category of parsed) {
						const catId = (
							await ctx.db
								.insert(categoryTable)
								.values({
									name: category.name,
									order: category.order,
									maxCols: category.maxCols ?? 5,
								})
								.returning({ name: categoryTable.name })
						)[0]?.name;
						if (!catId) continue;

						for (const service of category.services) {
							await ctx.db.insert(servicesTable).values({
								...service,
								categoryName: catId,
							});
						}
					}
					break;
				}
				case "homepage": {
					const parsed = yaml.load(input.data) as Array<
						Record<
							string,
							Array<
								Record<
									string,
									{
										icon: string;
										href: string;
									}
								>
							>
						>
					>;
					for (let index = 0; index < parsed.length; index++) {
						const category = parsed[index];
						if (!category) continue;
						const _categorykeys = Object.keys(category);
						if (!_categorykeys.length) continue;
						const categoryName = _categorykeys[0];
						if (!categoryName) continue;
						const _categoryvalues = Object.values(category);
						if (!_categoryvalues.length) continue;
						const services = _categoryvalues[0];
						if (!services) continue;

						const catId = (
							await ctx.db
								.insert(categoryTable)
								.values({
									name: categoryName,
									order: index,
								})
								.returning({ name: categoryTable.name })
						)[0]?.name;
						if (!catId) continue;

						for (let i = 0; i < services.length; i++) {
							const service = services[i];
							if (!service) continue;
							const _servicekeys = Object.keys(service);
							if (!_servicekeys.length) continue;
							const serviceName = _servicekeys[0];
							if (!serviceName) continue;
							const _servicevalues = Object.values(service);
							if (!_servicevalues.length) continue;
							const serviceValues = _servicevalues[0];
							if (!serviceValues) continue;

							await ctx.db.insert(servicesTable).values({
								name: serviceName,
								url: serviceValues.href,
								icon: `https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/${serviceName
									.replaceAll(" ", "-")
									.toLowerCase()}.png`,
								categoryName: catId,
								order: i,
							});
						}
					}
					break;
				}
			}

			refreshIndexPage();
		}),
});
