import type { WidgetConfig } from "~/lib/widgets";

export const getWidgetData = async (_config: WidgetConfig<"claude-usage">) => {
	return { type: "iframe" as const };
};
