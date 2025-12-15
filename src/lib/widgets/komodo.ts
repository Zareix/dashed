import type { CommandList } from "~/actions/command";
import { tryCatch } from "~/lib/try-catch";
import type { WidgetConfig } from "~/lib/widgets";

type KomodoListServersResponse = Array<{
	id: string;
	type: "Server";
	name: string;
	template: boolean;
	info: {
		state: "NotOk" | "Ok" | "Disabled";
		region: string;
		address: string;
		version: string;
		send_unreachable_alerts: boolean;
		send_cpu_alerts: boolean;
		send_mem_alerts: boolean;
		send_disk_alerts: boolean;
		terminals_disabled: boolean;
		container_exec_disabled: boolean;
	};
}>;

type KomodoListStacksResponse = Array<{
	id: string;
	type: "Stack";
	name: string;
	template: boolean;
	// tags: any[]
	info: {
		server_id: string;
		files_on_host: boolean;
		file_contents: boolean;
		linked_repo: string;
		git_provider: string;
		repo: string;
		branch: string;
		repo_link: string;
		state:
			| "deploying"
			| "running"
			| "paused"
			| "stopped"
			| "created"
			| "restarting"
			| "dead"
			| "removing"
			| "unhealthy"
			| "down"
			| "unknown";
		status: string | null;
		services: Array<{
			service: string;
			image: string;
			update_available: boolean;
		}>;
		project_missing: boolean;
		// missing_files: any[];
		deployed_hash: null;
		latest_hash: null;
	};
}>;

export const getWidgetData = async (config: WidgetConfig<"komodo">) => {
	const res = await tryCatch(
		Promise.all([
			fetch(`${config.url}/read`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-API-Key": config.apiKey,
					"X-API-Secret": config.apiSecret,
				},
				body: JSON.stringify({
					type: "ListServers",
					params: {},
				}),
			}).then((res) => {
				if (!res.ok) {
					throw new Error(`Failed to fetch komodo servers: ${res.statusText}`);
				}
				return res.json() as Promise<KomodoListServersResponse>;
			}),
			fetch(`${config.url}/read`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-API-Key": config.apiKey,
					"X-API-Secret": config.apiSecret,
				},
				body: JSON.stringify({
					type: "ListStacks",
					params: {},
				}),
			}).then((res) => {
				if (!res.ok) {
					throw new Error(`Failed to fetch komodo stacks: ${res.statusText}`);
				}
				return res.json() as Promise<KomodoListStacksResponse>;
			}),
		]),
	);
	if (res.error) {
		throw res.error;
	}
	const [serversData, stacksData] = res.data;
	return {
		servers: serversData.map((server) => ({
			id: server.id,
			name: server.name,
			state: server.info.state,
		})),
		stacks: stacksData.map((stack) => ({
			id: stack.id,
			name: stack.name,
			state: stack.info.state,
		})),
	};
};

export const getWidgetCommands = async (
	config: WidgetConfig<"komodo">,
): Promise<CommandList> => {
	const data = await getWidgetData(config);
	const commands: CommandList = {};

	for (const server of data.servers) {
		commands.server = commands.server ?? [];
		commands.server.push({
			name: server.name,
			url: `${config.url}/servers/${server.id}`,
			information: server.state,
		});
	}

	for (const stack of data.stacks) {
		commands.stack = commands.stack ?? [];
		commands.stack.push({
			name: stack.name,
			url: `${config.url}/stacks/${stack.id}`,
			information: stack.state,
		});
	}

	return commands;
};
