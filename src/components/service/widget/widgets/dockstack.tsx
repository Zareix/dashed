import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { AlertsWidgetPart } from "~/components/service/widget/parts/alerts";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";
import { StatsGridWidgetPart } from "../parts/stats-grid";

type Props = {
	config: Extract<WIDGETS, { type: "dockstack" }>["config"];
};

export const DockstackWidget = ({ config }: Props) => {
	const { isLoading, data, isError } = useQuery(
		{
			queryKey: ["widget", "dockstack", config],
			queryFn: () => actions.widget.dockstack(config),
			select: (res) => {
				if (res.error) throw new Error(res.error.message);
				return res.data;
			},
		},
		queryClient,
	);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError || !data) {
		return <div>Error</div>;
	}

	const stacksDown = data.stacks.filter(
		(stack) => stack.status !== "running" && stack.status !== "healthy",
	);

	const alerts: React.ComponentProps<typeof AlertsWidgetPart>["alerts"] = [];
	if (stacksDown.length > 0) {
		alerts.push({
			type: "error",
			source: `${stacksDown.length} stack(s) down`,
			items: stacksDown.map((stack) => `${stack.name} (${stack.status})`),
		});
	}

	return (
		<div className="max-w-75">
			<StatsGridWidgetPart
				stats={[
					{
						value: data.stacks.length,
						label: "Stacks",
					},
				]}
			/>
			<AlertsWidgetPart alerts={alerts} />
		</div>
	);
};
