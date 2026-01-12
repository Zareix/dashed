import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";
import { AlertsWidgetpart } from "../parts/alerts";

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
			<div>
				<span className="font-bold">{data.activeIndexers}</span> active indexers
				out of <span className="font-bold">{data.totalIndexers}</span> total
			</div>
			<AlertsWidgetpart alerts={healthIssues} />
		</div>
	);
};
