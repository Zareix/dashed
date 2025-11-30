import { z } from "astro:schema";
import { WIDGETS } from "~/lib/widgets";

export const serviceCreateSchema = z.object({
	id: z.number().optional(),
	name: z.string().min(1),
	url: z.string().url(),
	pingUrl: z
		.union([z.string().url(), z.literal(""), z.null(), z.undefined()])
		.transform((v) => (v === "" || v == null ? null : v)),
	alternativeUrls: z
		.array(
			z.object({
				url: z.string().url(),
				name: z.string().min(1),
			}),
		)
		.optional()
		.default([]),
	icon: z.string().url(),
	iconDark: z.string().nullish(),
	categoryId: z.number(),
	openInNewTab: z.boolean(),
	widget: WIDGETS,
});
export type ServiceCreateFormData = z.infer<typeof serviceCreateSchema>;

export const serviceEditSchema = serviceCreateSchema.extend({
	id: z.number(),
});
export type ServiceEditFormData = z.infer<typeof serviceEditSchema>;
