import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { StatsGridWidgetPart } from "~/components/service/widget/parts/stats-grid";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";
import { AlertsWidgetPart } from "../parts/alerts";

type Props = {
	config: Extract<WIDGETS, { type: "prowlarr" }>["config"];
};

export const ProwlarrWidget = ({ config }: Props) => {
	const { isLoading, data, isError } = useQuery(
		{
			queryKey: ["widget", "prowlarr", config],
			queryFn: () => actions.widget.prowlarr(config),
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

	const healthIssues = data.allHealth;

	return (
		<div className="max-w-75">
			<StatsGridWidgetPart
				stats={[
					{
						label: "Total Indexers",
						value: data.totalIndexers,
					},
					{
						label: "Active Indexers",
						value: data.activeIndexers,
					},
				]}
			/>
			<AlertsWidgetPart alerts={healthIssues} />
		</div>
	);
};
