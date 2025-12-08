import { tryCatch } from "~/lib/try-catch";
import type { WidgetConfig } from "~/lib/widgets";

type QBittorrentTransferInfo = {
	dl_info_speed: number; // Global download rate (bytes/s)
	dl_info_data: number; // Data downloaded this session (bytes)
	up_info_speed: number; // Global upload rate (bytes/s)
	up_info_data: number; // Data uploaded this session (bytes)
};

export const getWidgetData = async (config: WidgetConfig<"qbittorrent">) => {
	// First, attempt to login if credentials are provided
	let cookie = "";
	if (
		config.username &&
		config.password &&
		config.username.trim() !== "" &&
		config.password.trim() !== ""
	) {
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
				// Extract the SID cookie from response
				const setCookie = res.headers.get("set-cookie");
				if (setCookie) {
					// Parse SID cookie by looking for SID= and extracting until ; or end
					const sidMatch = setCookie.match(/SID=([^;]+)/);
					if (sidMatch) {
						return `SID=${sidMatch[1]}`;
					}
				}
				return "";
			}),
		);
		if (loginRes.error) {
			throw loginRes.error;
		}
		cookie = loginRes.data;
	}

	// Fetch transfer info
	const headers: Record<string, string> = {};
	if (cookie) {
		headers.Cookie = cookie;
	}

	const res = await tryCatch(
		fetch(`${config.url}/api/v2/transfer/info`, {
			headers,
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
		downloadSpeed: res.data.dl_info_speed,
		downloadData: res.data.dl_info_data,
		uploadSpeed: res.data.up_info_speed,
		uploadData: res.data.up_info_data,
	};
};
