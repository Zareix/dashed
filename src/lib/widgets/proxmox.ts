import { tryCatch } from "~/lib/try-catch";
import type { WidgetConfig } from "~/lib/widgets";

type ProxmoxResource = {
	id: string;
	type: "qemu" | "lxc" | "storage" | "node";
	status?: "running" | "stopped";
	maxdisk?: number;
	disk?: number;
	node?: string;
};

type ProxmoxClusterResourcesResponse = Array<ProxmoxResource>;

type ProxmoxStorageStatus = {
	storage: string;
	type: string;
	content: string;
	active: number;
	enabled: number;
	avail: number;
	total: number;
	used: number;
};

type ProxmoxNodeStorageResponse = {
	data: Array<ProxmoxStorageStatus>;
};

const formatBytes = (bytes: number): string => {
	if (bytes < 0) return "0 B";
	if (bytes === 0) return "0 B";
	const k = 1024;
	const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
	const i = Math.min(
		Math.floor(Math.log(bytes) / Math.log(k)),
		sizes.length - 1,
	);
	return `${(bytes / k ** i).toFixed(2)} ${sizes[i]}`;
};

export const getWidgetData = async (config: WidgetConfig<"proxmox">) => {
	// Proxmox API uses Authorization: PVEAPIToken=USER@REALM!TOKENID=UUID
	const authHeader = `PVEAPIToken=${encodeURIComponent(config.tokenId)}=${encodeURIComponent(config.tokenSecret)}`;

	// Fetch cluster resources to get VMs and LXCs
	const resourcesRes = await tryCatch(
		fetch(`${config.url}/api2/json/cluster/resources`, {
			headers: {
				Authorization: authHeader,
			},
		}).then((res) => {
			if (!res.ok) {
				throw new Error(`Failed to fetch Proxmox resources: ${res.statusText}`);
			}
			return res.json() as Promise<{ data: ProxmoxClusterResourcesResponse }>;
		}),
	);

	if (resourcesRes.error) {
		throw resourcesRes.error;
	}

	const resources = resourcesRes.data.data;

	// Count running VMs and LXCs
	const vms = resources.filter((r) => r.type === "qemu");
	const runningVms = vms.filter((r) => r.status === "running").length;
	const totalVms = vms.length;

	const lxcs = resources.filter((r) => r.type === "lxc");
	const runningLxcs = lxcs.filter((r) => r.status === "running").length;
	const totalLxcs = lxcs.length;

	// Get storage information from the first node
	const nodes = resources.filter((r) => r.type === "node");
	const firstNode = nodes[0]?.id;

	if (!firstNode) {
		return {
			runningVms,
			totalVms,
			runningLxcs,
			totalLxcs,
			storageUsed: "N/A",
			storageTotal: "N/A",
			storagePercent: 0,
		};
	}

	const storageRes = await tryCatch(
		fetch(`${config.url}/api2/json/nodes/${firstNode}/storage`, {
			headers: {
				Authorization: authHeader,
			},
		}).then((res) => {
			if (!res.ok) {
				throw new Error(`Failed to fetch Proxmox storage: ${res.statusText}`);
			}
			return res.json() as Promise<ProxmoxNodeStorageResponse>;
		}),
	);

	if (storageRes.error) {
		// If storage fetch fails, still return VM/LXC data
		return {
			runningVms,
			totalVms,
			runningLxcs,
			totalLxcs,
			storageUsed: "N/A",
			storageTotal: "N/A",
			storagePercent: 0,
		};
	}

	// Sum up storage across all storage devices
	let totalStorage = 0;
	let usedStorage = 0;

	for (const storage of storageRes.data.data) {
		if (storage.active && storage.enabled) {
			totalStorage += storage.total;
			usedStorage += storage.used;
		}
	}

	const storagePercent =
		totalStorage > 0 ? Math.round((usedStorage / totalStorage) * 100) : 0;

	return {
		runningVms,
		totalVms,
		runningLxcs,
		totalLxcs,
		storageUsed: formatBytes(usedStorage),
		storageTotal: formatBytes(totalStorage),
		storagePercent,
	};
};
