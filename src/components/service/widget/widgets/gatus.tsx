import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "~/components/ui/badge";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";
import { StatsGridWidgetPart } from "../parts/stats-grid";

type Props = {
	config: Extract<WIDGETS, { type: "gatus" }>["config"];
};

export const GatusWidget = ({ config }: Props) => {
	const { data, isError, isLoading } = useQuery(
		{
			queryKey: ["widget", "gatus", config],
			queryFn: () => actions.widget.gatus(config),
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

	const upServices = data.filter((service) => service.success);
	const downServices = data.filter((service) => !service.success);

	const groupedDownServices = downServices.reduce(
		(acc, service) => {
			if (!acc[service.group]) {
				acc[service.group] = [];
			}
			acc[service.group].push(service);
			return acc;
		},
		{} as Record<string, typeof downServices>,
	);

	return (
		<div className="max-w-75">
			<StatsGridWidgetPart
				className="min-w-37.5"
				stats={[
					{
						value: upServices.length,
						label: "Up",
					},
					{
						value: downServices.length,
						label: "Down",
					},
				]}
			/>
			{downServices.length > 0 &&
				Object.entries(groupedDownServices).map(([group, services]) => (
					<div key={group} className="mt-2 border-t pt-1">
						<h3 className="mb-1 font-medium">🚨 {group}</h3>
						<div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
							{services.map((x) => (
								<Badge key={x.group + x.name} variant="destructive">
									{x.name}
								</Badge>
							))}
						</div>
					</div>
				))}
		</div>
	);
};
