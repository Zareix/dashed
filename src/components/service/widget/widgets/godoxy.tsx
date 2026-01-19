import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { AlertsWidgetPart } from "~/components/service/widget/parts/alerts";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";
import { StatsGridWidgetPart } from "../parts/stats-grid";

type Props = {
	config: Extract<WIDGETS, { type: "godoxy" }>["config"];
};

export const GodoxyWidget = ({ config }: Props) => {
	const { data, isError, isLoading } = useQuery(
		{
			queryKey: ["widget", "godoxy", config],
			queryFn: () => actions.widget.godoxy(config),
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

	const totalRoutesWithHealthCheck = data.routes.filter(
		(r) => r.health !== "disabled",
	);
	const unhealthyRoutes = totalRoutesWithHealthCheck
		.filter((r) => r.health !== "healthy")
		.map((r) => r.alias);
	const healthyRoutesCount = data.routes.filter(
		(r) => r.health === "healthy",
	).length;

	return (
		<div className="max-w-75">
			<StatsGridWidgetPart
				stats={[
					{
						value: data.routes.length,
						label: "Routes",
					},
					{
						value: (
							<span>
								{healthyRoutesCount}/{totalRoutesWithHealthCheck.length}
							</span>
						),
						label: "Healthy",
					},
				]}
			/>
			<AlertsWidgetPart
				alerts={[
					{
						type: "error",
						source: `Down route${unhealthyRoutes.length > 1 ? "s" : ""}`,
						message: unhealthyRoutes.join(", "),
					},
				]}
			/>
		</div>
	);
};
