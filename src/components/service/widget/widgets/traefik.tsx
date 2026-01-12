import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";
import { AlertsWidgetPart } from "../parts/alerts";
import { StatsGridWidgetPart } from "../parts/stats-grid";

type Props = {
	config: Extract<WIDGETS, { type: "traefik" }>["config"];
};

export const TraefikWidget = ({ config }: Props) => {
	const { isLoading, data, isError } = useQuery(
		{
			queryKey: ["widget", "traefik", config],
			queryFn: () => actions.widget.traefik(config),
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

	return (
		<div className="max-w-75">
			<StatsGridWidgetPart
				stats={[
					{
						value: data.routers,
						label: "Routers",
					},
					{
						value: data.services,
						label: "Services",
					},
					{
						value: data.middlewares,
						label: "Middlewares",
					},
				]}
			/>
			<AlertsWidgetPart alerts={data.alerts} />
		</div>
	);
};
