import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { asc } from "drizzle-orm";
import { db } from "~/lib/db";
import { categoryTable, serviceTable } from "~/lib/db/schema";
import { serviceCreateSchema } from "~/lib/schema";

const exportSchema = z.array(
	z.object({
		name: z.string().min(1),
		maxCols: z.number().min(1).max(5),
		order: z.number(),
		services: z.array(
			serviceCreateSchema.omit({
				categoryId: true,
			}),
		),
	}),
);
type ExportType = z.infer<typeof exportSchema>;

export const importExport = {
	import: defineAction({
		input: z.object({
			type: z.enum(["dashed", "homepage"]),
			eraseExisting: z.boolean().default(false),
			data: z.string().min(1),
		}),
		handler: async (input) => {
			if (input.eraseExisting) {
				await db.delete(serviceTable);
				await db.delete(categoryTable);
			}
			switch (input.type) {
				case "dashed": {
					const parsed = exportSchema.parse(JSON.parse(input.data));
					for (const category of parsed) {
						const catId = (
							await db
								.insert(categoryTable)
								.values({
									name: category.name,
									order: category.order,
									maxCols: category.maxCols ?? 5,
								})
								.returning({ id: categoryTable.id })
						)[0]?.id;
						if (!catId) continue;

						for (const service of category.services) {
							await db.insert(serviceTable).values({
								...service,
								categoryId: catId,
							});
						}
					}
					break;
				}
				// case "homepage": {
				//   const parsed = yaml.load(input.data) as Array<
				//     Record<
				//       string,
				//       Array<
				//         Record<
				//           string,
				//           {
				//             icon: string;
				//             href: string;
				//           }
				//         >
				//       >
				//     >
				//   >;
				//   for (let index = 0; index < parsed.length; index++) {
				//     const category = parsed[index];
				//     if (!category) continue;
				//     const _categorykeys = Object.keys(category);
				//     if (!_categorykeys.length) continue;
				//     const categoryName = _categorykeys[0];
				//     if (!categoryName) continue;
				//     const _categoryvalues = Object.values(category);
				//     if (!_categoryvalues.length) continue;
				//     const services = _categoryvalues[0];
				//     if (!services) continue;

				//     const catId = (
				//       await db
				//         .insert(categoryTable)
				//         .values({
				//           name: categoryName,
				//           order: index,
				//         })
				//         .returning({ name: categoryTable.name })
				//     )[0]?.name;
				//     if (!catId) continue;

				//     for (let i = 0; i < services.length; i++) {
				//       const service = services[i];
				//       if (!service) continue;
				//       const _servicekeys = Object.keys(service);
				//       if (!_servicekeys.length) continue;
				//       const serviceName = _servicekeys[0];
				//       if (!serviceName) continue;
				//       const _servicevalues = Object.values(service);
				//       if (!_servicevalues.length) continue;
				//       const serviceValues = _servicevalues[0];
				//       if (!serviceValues) continue;

				//       await db.insert(servicesTable).values({
				//         name: serviceName,
				//         url: serviceValues.href,
				//         icon: `https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/${serviceName
				//           .replaceAll(" ", "-")
				//           .toLowerCase()}.png`,
				//         categoryName: catId,
				//         order: i,
				//       });
				//     }
				//   }
				//   break;
				// }
			}
		},
	}),
	export: defineAction({
		handler: async () => {
			return (await db.query.categoryTable.findMany({
				with: {
					services: {
						orderBy: [asc(serviceTable.order)],
					},
				},
				orderBy: [asc(categoryTable.order)],
			})) satisfies ExportType;
		},
	}),
};
