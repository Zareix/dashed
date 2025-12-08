import { tryCatch } from "~/lib/try-catch";
import type { WIDGETS } from "~/lib/widgets";

type KarakeepListsResponse = {
	lists: Array<{
		type: "manual" | "smart";
		id: string;
		name: string;
		description?: string;
		icon: string;
		parentId?: string;
		query?: string;
		public: boolean;
	}>;
};

export const getWidgetData = async (
	config: Extract<WIDGETS, { type: "karakeep" }>["config"],
) => {
	const res = await tryCatch(
		fetch(`${config.url}/api/v1/lists`, {
			headers: {
				Authorization: `Bearer ${config.apiKey}`,
			},
		}).then((res) => {
			if (!res.ok) {
				throw new Error(`Failed to fetch karakeep lists: ${res.statusText}`);
			}
			return res.json() as Promise<KarakeepListsResponse>;
		}),
	);
	if (res.error) {
		throw res.error;
	}

	return {
		lists: res.data.lists
			.toSorted((a, b) => a.name.localeCompare(b.name))
			.map((x) => ({
				id: x.id,
				icon: x.icon,
				name: x.name,
				url: `${config.url}/dashboard/lists/${x.id}`,
			})),
	};
};
