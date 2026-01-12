import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { AlertsWidgetPart } from "~/components/service/widget/parts/alerts";
import { StatsGridWidgetPart } from "~/components/service/widget/parts/stats-grid";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";

type Props = {
	config: Extract<WIDGETS, { type: "uptime-kuma" }>["config"];
};

const UptimeKumaWidget = ({ config }: Props) => {
	const { data, isError, isLoading } = useQuery(
		{
			queryKey: ["widget", "uptime-kuma", config],
			queryFn: () => actions.widget["uptime-kuma"](config),
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

	const upServices = data.metrics.filter((service) => service.status === 1);
	const downServices = data.metrics.filter((service) => service.status === 0);

	return (
		<div className="max-w-75">
			<StatsGridWidgetPart
				stats={[
					{
						label: "Up",
						value: upServices.length,
					},
					{
						label: "Down",
						value: downServices.length,
					},
				]}
			/>
			<AlertsWidgetPart
				alerts={[
					{
						type: "error",
						source: "Down Services",
						message: downServices.map((x) => x.monitor_name).join(", "),
					},
				]}
			/>
		</div>
	);
};

export default UptimeKumaWidget;
