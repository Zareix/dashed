import type { WidgetConfig } from "~/lib/widgets";

export const getWidgetData = async (
	_config: WidgetConfig<"home-assistant">,
) => {
	// Home Assistant widget is iframe-only, no data fetching needed
	return { type: "iframe" as const };
};
