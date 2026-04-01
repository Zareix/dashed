import type { CommandList } from "~/actions/command";
import { tryCatch } from "~/lib/try-catch";
import type { WidgetConfig } from "~/lib/widgets";

type PaginatedResponse<T> = {
	/**
	 * A URL to the JSON Schema for this object.
	 */
	$schema?: string;
	data: T[];
	/**
	 * Current page number (1-indexed)
	 */
	currentPage: number;
	/**
	 * Total number of items without filters
	 */
	grandTotalItems?: number;
	/**
	 * Number of items per page
	 */
	itemsPerPage: number;
	/**
	 * Total number of items in the current filtered set
	 */
	totalItems: number;
	/**
	 * Total number of pages
	 */
	totalPages: number;
	success: boolean;
};

type EnvResponse = PaginatedResponse<{
	apiKey?: string;
	apiUrl: string;
	connected?: boolean;
	connectedAt?: Date;
	edgeTransport?: string;
	enabled: boolean;
	id: string;
	isEdge: boolean;
	lastHeartbeat?: Date;
	lastPollAt?: Date;
	name?: string;
	status: string;
}>;

type ProjectResponse = PaginatedResponse<{
	id: string;
	name: string;
	status: string;
}>;

export const getWidgetData = async (config: WidgetConfig<"arcane">) => {
	const environments = await tryCatch(
		fetch(`${config.url}/api/environments`, {
			headers: {
				"Content-Type": "application/json",
				"X-Api-Key": config.apiKey,
			},
		}).then(async (res) => {
			if (!res.ok) {
				throw new Error(`Failed to fetch arcane servers: ${res.statusText}`);
			}
			return ((await res.json()) as EnvResponse).data;
		}),
	);
	if (environments.error) {
		throw environments.error;
	}

	const projects = await tryCatch(
		Promise.all(
			environments.data.map(async ({ id }) =>
				fetch(`${config.url}/api/environments/${id}/projects?limit=999`, {
					headers: {
						"Content-Type": "application/json",
						"X-Api-Key": config.apiKey,
					},
				}).then(async (res) => {
					if (!res.ok) {
						throw new Error(
							`Failed to fetch arcane projects for env ${id}: ${res.statusText}`,
						);
					}
					return ((await res.json()) as ProjectResponse).data;
				}),
			),
		),
	);
	if (projects.error) {
		throw projects.error;
	}
	console.log(projects.data);

	return {
		environments: environments.data.map((environment) => ({
			id: environment.id,
			name: environment.name,
			status: environment.status,
		})),
		projects: projects.data.flat().map((project) => ({
			id: project.id,
			name: project.name,
			status: project.status,
		})),
	};
};

export const getWidgetCommands = async (
	config: WidgetConfig<"arcane">,
): Promise<CommandList> => {
	const data = await getWidgetData(config);
	const commands: CommandList = {};

	for (const environment of data.environments) {
		commands.environment = commands.environment ?? [];
		commands.environment.push({
			name: environment.name ?? environment.id,
			url: `${config.url}/environments/${environment.id}`,
			information: environment.status,
		});
	}

	for (const project of data.projects) {
		commands.project = commands.project ?? [];
		commands.project.push({
			name: project.name,
			url: `${config.url}/projects/${project.id}`,
			information: project.status,
		});
	}

	return commands;
};
