export type KomodoListServersResponse = Array<{
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

export type KomodoListStacksResponse = Array<{
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
