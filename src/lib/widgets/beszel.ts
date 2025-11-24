import { tryCatch } from "~/lib/try-catch";
import type { WidgetConfig } from "~/lib/widgets";

type BeszelAuthResponse = {
	token: string;
};

type BeszelSystemResponse = {
	items: Array<{
		id: string;
		name: string;
		host: string;
		port: number;
		info: {
			b: number;
			c: number;
			cpu: number;
			dp: number;
			dt: number;
			h: string;
			k: string;
			m: string;
			mp: number;
			t: number;
			u: number;
			v: string;
		};
		status: string;
	}>;
};

export const getWidgetData = async (config: WidgetConfig<"beszel">) => {
	const auth = await tryCatch(
		fetch(`${config.url}/api/collections/users/auth-with-password`, {
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				identity: config.email,
				password: config.password,
			}),
		}).then(async (res) => {
			if (res.ok) {
				return res.json() as Promise<BeszelAuthResponse>;
			}
			throw new Error(`Login failed : ${await res.text()}`);
		}),
	);
	if (auth.error) {
		throw auth.error;
	}

	const res = await tryCatch(
		fetch(
			`${config.url}/api/collections/systems/records?page=1&perPage=500&skipTotal=1&sort=+name&fields=id,name,host,port,info,status`,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${auth.data.token}`,
				},
			},
		).then((res) => {
			if (res.ok) {
				return res.json() as Promise<BeszelSystemResponse>;
			}
			throw new Error("Failed to fetch systems");
		}),
	);
	if (res.error) {
		throw res.error;
	}
	return res.data.items
		.map((system) => ({
			id: system.id,
			name: system.name,
			host: system.host,
			info: {
				cpuUsagePercent: system.info.cpu,
				memoryUsagePercent: system.info.mp,
				diskUsagePercent: system.info.dp,
				temperature: system.info.dt,
			},
			status: system.status,
		}))
		.sort((a, b) => a.name.localeCompare(b.name));
};
