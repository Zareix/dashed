import { tryCatch } from "~/lib/try-catch";
import type { WidgetConfig } from "~/lib/widgets";

type DockstackStacksResponse = Array<{
	name: string;
	status: string;
}>;

export const getWidgetData = async (config: WidgetConfig<"dockstack">) => {
	const res = await tryCatch(
		fetch(`${config.url}/api/stacks`, {
			headers: {
				Authorization: `Bearer ${config.apiKey}`,
			},
		}).then((res) => {
			if (!res.ok) {
				throw new Error(`Failed to fetch Dockstack stacks: ${res.statusText}`);
			}
			return res.json() as Promise<DockstackStacksResponse>;
		}),
	);
	if (res.error) {
		throw res.error;
	}

	return {
		stacks: res.data.map((stack) => ({
			name: stack.name,
			status: stack.status,
		})),
	};
};
