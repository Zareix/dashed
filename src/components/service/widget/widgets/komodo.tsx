import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { AlertsWidgetPart } from "~/components/service/widget/parts/alerts";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";
import { StatsGridWidgetPart } from "../parts/stats-grid";

type Props = {
	config: Extract<WIDGETS, { type: "komodo" }>["config"];
};

export const KomodoWidget = ({ config }: Props) => {
	const { isLoading, data, isError } = useQuery(
		{
			queryKey: ["widget", "komodo", config],
			queryFn: () => actions.widget.komodo(config),
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

	const serversDown = data.servers.filter((server) => server.state !== "Ok");
	const stacksDown = data.stacks.filter(
		(stack) =>
			stack.state === "down" ||
			stack.state === "unhealthy" ||
			stack.state === "stopped" ||
			stack.state === "dead" ||
			stack.state === "unknown",
	);

	const alerts: React.ComponentProps<typeof AlertsWidgetPart>["alerts"] = [];
	if (serversDown.length > 0) {
		alerts.push({
			type: "error",
			source: `${serversDown.length} server(s) down`,
			message: serversDown
				.map((server) => `${server.name} (${server.state})`)
				.join(", "),
		});
	}
	if (stacksDown.length > 0) {
		alerts.push({
			type: "error",
			source: `${stacksDown.length} stack(s) down`,
			message: stacksDown
				.map((stack) => `${stack.name} (${stack.state})`)
				.join(", "),
		});
	}

	return (
		<div className="max-w-75">
			<StatsGridWidgetPart
				stats={[
					{
						value: data.servers.length,
						label: "Servers",
					},
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
