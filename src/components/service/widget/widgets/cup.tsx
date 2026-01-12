import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";
import { StatsGridWidgetPart } from "../parts/stats-grid";

type Props = {
	config: Extract<WIDGETS, { type: "cup" }>["config"];
};

export const CupWidget = ({ config }: Props) => {
	const { isLoading, data, isError } = useQuery(
		{
			queryKey: ["widget", "cup", config],
			queryFn: () => actions.widget.cup(config),
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
		<div className="w-75">
			<StatsGridWidgetPart
				stats={[
					{
						value: data.monitoredImages,
						label: "Monitored",
					},
					{
						value: data.updatesAvailable,
						label: "Updates",
					},
					{
						value: data.upToDate,
						label: "Up to date",
					},
				]}
			/>
		</div>
	);
};
