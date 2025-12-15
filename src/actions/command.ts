import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { asc } from "drizzle-orm";
import { db } from "~/lib/db";
import type { WIDGETS, WidgetConfig } from "~/lib/widgets";
import * as komodo from "../lib/widgets/komodo";
import * as radarr from "../lib/widgets/radarr";
import * as sonarr from "../lib/widgets/sonarr";

export type Command = {
	name: string;
	information?: string;
	url: string;
	serviceId?: number;
	icon?: string;
};
export type CommandList = Record<string, Command[]>;

type WidgetCommandGetter = {
	[K in WIDGETS["type"]]?: (config: WidgetConfig<K>) => Promise<CommandList>;
};

const WIDGET_COMMAND_GETTER: WidgetCommandGetter = {
	komodo: komodo.getWidgetCommands,
	sonarr: sonarr.getWidgetCommands,
	radarr: radarr.getWidgetCommands,
};
const WIDGETS_WITH_COMMANDS = Object.keys(WIDGET_COMMAND_GETTER);

export const command = {
	getBaseCommands: defineAction({
		handler: async () => {
			const commands: CommandList = {};

			const categoriesWithServices = await db.query.categoryTable.findMany({
				with: {
					services: {
						orderBy: (service) => [asc(service.order)],
					},
				},
				orderBy: (category) => [asc(category.order)],
			});

			for (const category of categoriesWithServices) {
				for (const service of category.services) {
					commands[category.name] = commands[category.name] ?? [];
					commands[category.name].push({
						name: service.name,
						icon: service.icon,
						url: service.url,
						serviceId: WIDGETS_WITH_COMMANDS.includes(service.widget.type)
							? service.id
							: undefined,
					});
					for (const altUrl of service.alternativeUrls) {
						commands[category.name].push({
							name: `${service.name} > ${altUrl.name}`,
							icon: service.icon,
							url: altUrl.url,
							serviceId: WIDGETS_WITH_COMMANDS.includes(service.widget.type)
								? service.id
								: undefined,
						});
					}
				}
			}

			return commands;
		},
	}),
	getWidgetCommands: defineAction({
		input: z.number(),
		handler: async (serviceId) => {
			const service = await db.query.serviceTable.findFirst({
				where: (service, { eq }) => eq(service.id, serviceId),
			});
			if (!service) {
				throw new Error("Service not found");
			}
			const getter = WIDGET_COMMAND_GETTER[service.widget.type];
			if (!getter) {
				throw new Error(
					`No command getter for widget type: ${service.widget.type}`,
				);
			}
			// 'never' is used here because TypeScript cannot infer that
			// 'widget.config' matches the expected type for the getter function.
			return await getter(service.widget.config as never);
		},
	}),
};
