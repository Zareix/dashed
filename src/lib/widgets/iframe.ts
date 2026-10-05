import type { WidgetConfig } from "~/lib/widgets"

export const getWidgetData = async (_config: WidgetConfig<"iframe">) => {
  // Iframe widget is client-side only, no data fetching needed
  return { type: "iframe" as const }
}
