import { tryCatch } from "~/lib/try-catch";
import type { WidgetConfig } from "~/lib/widgets";

type ProxmoxNodesResponse = {
	data: Array<{
		node: string;
		status: "online" | "offline";
		type: "node";
	}>;
};

type ProxmoxVMsResponse = {
	data: Array<{
		vmid: number;
		name: string;
		status: "running" | "stopped";
		type: "qemu";
	}>;
};

type ProxmoxLXCsResponse = {
	data: Array<{
		vmid: number;
		name: string;
		status: "running" | "stopped";
		type: "lxc";
	}>;
};

type ProxmoxStorageResponse = {
	data: Array<{
		storage: string;
		type: string;
		content: string;
		active: number;
		enabled: number;
		avail: number;
		total: number;
		used: number;
	}>;
};

export const getWidgetData = async (config: WidgetConfig<"proxmox">) => {
	const authHeader = `PVEAPIToken=${encodeURIComponent(config.tokenId)}=${encodeURIComponent(config.tokenSecret)}`;

	const nodesRes = await tryCatch(
		fetch(`${config.url}/api2/json/nodes`, {
			headers: {
				Authorization: authHeader,
			},
		}).then((res) => {
			if (!res.ok) {
				throw new Error(`Failed to fetch Proxmox nodes: ${res.statusText}`);
			}
			return res.json() as Promise<ProxmoxNodesResponse>;
		}),
	);

	if (nodesRes.error) {
		throw nodesRes.error;
	}

	const nodes = nodesRes.data.data;

	if (nodes.length === 0) {
		throw new Error("No nodes found in Proxmox cluster");
	}

	const nodesResults = await Promise.allSettled(
		nodes.map(async (node) => {
			const nodeName = node.node;

			const [vmsRes, lxcsRes, storageRes] = await Promise.all([
				tryCatch(
					fetch(`${config.url}/api2/json/nodes/${nodeName}/qemu`, {
						headers: {
							Authorization: authHeader,
						},
					}).then((res) => {
						if (!res.ok) {
							throw new Error(
								`Failed to fetch VMs for ${nodeName}: ${res.statusText}`,
							);
						}
						return res.json() as Promise<ProxmoxVMsResponse>;
					}),
				),
				tryCatch(
					fetch(`${config.url}/api2/json/nodes/${nodeName}/lxc`, {
						headers: {
							Authorization: authHeader,
						},
					}).then((res) => {
						if (!res.ok) {
							throw new Error(
								`Failed to fetch LXCs for ${nodeName}: ${res.statusText}`,
							);
						}
						return res.json() as Promise<ProxmoxLXCsResponse>;
					}),
				),
				tryCatch(
					fetch(`${config.url}/api2/json/nodes/${nodeName}/storage`, {
						headers: {
							Authorization: authHeader,
						},
					}).then((res) => {
						if (!res.ok) {
							throw new Error(
								`Failed to fetch storage for ${nodeName}: ${res.statusText}`,
							);
						}
						return res.json() as Promise<ProxmoxStorageResponse>;
					}),
				),
			]);

			if (vmsRes.error) {
				throw vmsRes.error;
			}

			if (lxcsRes.error) {
				throw lxcsRes.error;
			}

			let totalStorage = 0;
			let usedStorage = 0;
			let storagePercent = 0;
			const inaccessibleStorage: Array<string> = [];

			if (storageRes.error) {
				throw storageRes.error;
			}
			for (const storage of storageRes.data.data) {
				if (storage.enabled) {
					if (storage.active) {
						totalStorage += storage.total;
						usedStorage += storage.used;
					} else {
						inaccessibleStorage.push(storage.storage);
					}
				}

				storagePercent =
					totalStorage > 0 ? Math.round((usedStorage / totalStorage) * 100) : 0;
			}

			return {
				node: nodeName,
				vms: vmsRes.data.data,
				lxcs: lxcsRes.data.data,
				storageUsed: usedStorage,
				storageTotal: totalStorage,
				storagePercent,
				inaccessibleStorage,
			};
		}),
	);

	const nodesData = nodesResults
		.filter(
			(
				result,
			): result is PromiseFulfilledResult<{
				node: string;
				vms: Array<ProxmoxVMsResponse["data"][0]>;
				lxcs: Array<ProxmoxLXCsResponse["data"][0]>;
				storageUsed: number;
				storageTotal: number;
				storagePercent: number;
				inaccessibleStorage: Array<string>;
			}> => result.status === "fulfilled",
		)
		.map((result) => result.value);

	return nodesData;
};
