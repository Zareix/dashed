import { asc } from "drizzle-orm";
import { PHASE_PRODUCTION_BUILD } from "next/dist/shared/lib/constants";
import { cache } from "react";
import type { WIDGETS } from "~/lib/widgets";
import { db } from "~/server/db";
import {
	type AlternativeUrl,
	categoryTable,
	servicesTable,
} from "~/server/db/schema";

export const getData = cache(async () => {
	if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
		return [];
	}
	const categories = await db.query.categoryTable.findMany({
		with: {
			services: {
				orderBy: [asc(servicesTable.order)],
			},
		},
		orderBy: [asc(categoryTable.order)],
	});
	return categories.map((category) => ({
		name: category.name,
		maxCols: category.maxCols,
		services: category.services.map((service) => ({
			id: service.id,
			name: service.name,
			url: service.url,
			icon: service.icon,
			openInNewTab: service.openInNewTab,
			widget: service.widget as WIDGETS,
			alternativeUrls: service.alternativeUrls as Array<AlternativeUrl>,
		})),
	}));
});
