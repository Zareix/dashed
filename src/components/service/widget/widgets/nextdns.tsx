import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { StatsGridWidgetPart } from "~/components/service/widget/parts/stats-grid";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";

type Props = {
	config: Extract<WIDGETS, { type: "nextdns" }>["config"];
};

export const NextDNSWidget = ({ config }: Props) => {
	const { isLoading, data, isError } = useQuery(
		{
			queryKey: ["widget", "nextdns", config],
			queryFn: () => actions.widget.nextdns(config),
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

	const percentageBlocked = data.blocked
		? ((data.blocked / (data.default + data.blocked)) * 100).toFixed(2)
		: "0.00";

	return (
		<div className="max-w-75">
			<StatsGridWidgetPart
				title="Last 24h summary"
				stats={[
					{
						value: data.default,
						label: "Total",
					},
					{
						value: data.blocked,
						label: "Blocked",
					},
					{
						value: `${percentageBlocked}%`,
						label: "Blocked",
					},
				]}
			/>
		</div>
	);
};
