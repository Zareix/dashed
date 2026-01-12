import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";
import { StatsGridWidgetPart } from "../parts/stats-grid";

type Props = {
	config: Extract<WIDGETS, { type: "vince" }>["config"];
};

export const VinceWidget = ({ config }: Props) => {
	const { isLoading, data, isError } = useQuery(
		{
			queryKey: ["widget", "vince", config],
			queryFn: () => actions.widget.vince(config),
			select: (res) => {
				if (res.error) throw new Error(res.error.message);
				return res.data;
			},
		},
		queryClient,
	);

	const formatDuration = (seconds: number) => {
		if (seconds < 60) return `${Math.round(seconds)}s`;
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = Math.round(seconds % 60);
		return `${minutes}m ${remainingSeconds}s`;
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError || !data) {
		return <div>Error</div>;
	}

	const totalVisitors = data.reduce((acc, site) => acc + site.visitors, 0);
	const totalPageviews = data.reduce((acc, site) => acc + site.pageviews, 0);
	const avgDuration =
		data.reduce((acc, site) => acc + site.visitDuration, 0) / data.length;
	const avgBounceRate =
		data.reduce((acc, site) => acc + site.bounceRate, 0) / data.length;

	return (
		<div className="max-w-62.5">
			<StatsGridWidgetPart
				title="Last 30 days summary"
				stats={[
					{
						value: totalVisitors.toLocaleString(),
						label: "Total Visitors",
					},
					{
						value: totalPageviews.toLocaleString(),
						label: "Total Pageviews",
					},
					{
						value: `${avgBounceRate.toFixed(0)}%`,
						label: "Avg. Bounce Rate",
					},
					{
						value: formatDuration(avgDuration),
						label: "Avg. Duration",
					},
				]}
			/>
			{data.length > 0 && (
				<div className="mt-2 flex flex-col gap-2 border-t pt-2">
					{data.map((site) => (
						<a
							key={site.siteId}
							href={`${config.url}/${site.siteId}/?period=30d`}
							target="_blank"
							rel="noopener noreferrer"
							className="group flex items-center justify-between rounded-md p-2 transition-colors hover:bg-accent"
						>
							<div className="flex flex-col gap-0.5">
								<span className="flex items-center gap-1.5 font-medium text-sm">
									{site.siteId}
									<ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
								</span>
								<span className="text-muted-foreground text-xs">
									{site.visitors.toLocaleString()} visitors •{" "}
									{site.pageviews.toLocaleString()} pageviews •{" "}
									{site.bounceRate.toFixed(0)}% bounce rate •{" "}
									{formatDuration(site.visitDuration)} avg. duration
								</span>
							</div>
						</a>
					))}
				</div>
			)}
		</div>
	);
};
