import { tryCatch } from "~/lib/try-catch";
import type { WidgetConfig } from "~/lib/widgets";

type QBittorrentTransferInfo = {
	dl_info_speed: number; // Global download rate (bytes/s)
	dl_info_data: number; // Data downloaded this session (bytes)
	up_info_speed: number; // Global upload rate (bytes/s)
	up_info_data: number; // Data uploaded this session (bytes)
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

const formatSpeed = (bytesPerSecond: number): string => {
	return `${formatBytes(bytesPerSecond)}/s`;
};

export const getWidgetData = async (config: WidgetConfig<"qbittorrent">) => {
	const loginRes = await tryCatch(
		fetch(`${config.url}/api/v2/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: `username=${encodeURIComponent(config.username)}&password=${encodeURIComponent(config.password)}`,
		}).then((res) => {
			if (!res.ok) {
				throw new Error(`Failed to login to qBittorrent: ${res.statusText}`);
			}
			const setCookie = res.headers.get("set-cookie");
			if (!setCookie) {
				throw new Error("No set-cookie header received from qBittorrent");
			}
			const sidMatch = setCookie.match(/SID=([^;]+)/);
			if (!sidMatch) {
				throw new Error("No SID cookie found in qBittorrent response");
			}
			return `SID=${sidMatch[1]}`;
		}),
	);
	if (loginRes.error) {
		throw loginRes.error;
	}

	const res = await tryCatch(
		fetch(`${config.url}/api/v2/transfer/info`, {
			headers: {
				Cookie: loginRes.data,
			},
		}).then((res) => {
			if (!res.ok) {
				throw new Error(
					`Failed to fetch qBittorrent transfer info: ${res.statusText}`,
				);
			}
			return res.json() as Promise<QBittorrentTransferInfo>;
		}),
	);

	if (res.error) {
		throw res.error;
	}

	return {
		downloadSpeed: formatSpeed(res.data.dl_info_speed),
		downloadData: formatBytes(res.data.dl_info_data),
		uploadSpeed: formatSpeed(res.data.up_info_speed),
		uploadData: formatBytes(res.data.up_info_data),
	};
};
