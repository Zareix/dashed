import z from "zod";
import { WIDGETS } from "~/lib/widgets";

export const serviceEditSchema = z.object({
	id: z.number(),
	name: z.string().min(1),
	url: z.url(),
	alternativeUrls: z
		.array(
			z.object({
				url: z.url(),
				name: z.string().min(1),
			}),
		)
		.optional()
		.default([]),
	categoryName: z.string(),
	icon: z.url(),
	iconDark: z.url().nullable(),
	openInNewTab: z.boolean(),
	widget: WIDGETS,
});
export type ServiceEditFormData = z.infer<typeof serviceEditSchema>;

export const serviceCreateSchema = z.object({
	id: z.number().optional(),
	name: z.string().min(1),
	url: z.url(),
	alternativeUrls: z
		.array(
			z.object({
				url: z.url(),
				name: z.string().min(1),
			}),
		)
		.optional()
		.default([]),
	icon: z.url(),
	iconDark: z.string().nullable(),
	categoryName: z.string(),
	openInNewTab: z.boolean(),
	widget: WIDGETS,
});
export type ServiceCreateFormData = z.infer<typeof serviceCreateSchema>;
