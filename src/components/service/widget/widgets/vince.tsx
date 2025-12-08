import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";

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

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError || !data) {
		return <div>Error</div>;
	}

	const totalVisitors = data.reduce((acc, site) => acc + site.visitors, 0);
	const totalPageviews = data.reduce((acc, site) => acc + site.pageviews, 0);

	return (
		<div className="max-w-[400px]">
			<div
				className="grid grid-cols-2 gap-2 mb-3 [&>div]:rounded-md [&>div]:flex [&>div]:flex-col
		 [&>div]:text-center [&>div>div]:text-lg [&>div>p]:font-medium [&>div>p]:mt-auto [&>div>p]:text-sm"
			>
				<div>
					<div>{totalVisitors.toLocaleString()}</div>
					<p>Total Visitors</p>
				</div>
				<div>
					<div>{totalPageviews.toLocaleString()}</div>
					<p>Total Pageviews</p>
				</div>
			</div>
			{data.length > 0 && (
				<div className="border-t pt-2 space-y-2">
					<p className="text-xs font-medium text-muted-foreground">
						Registered Sites:
					</p>
					<div className="space-y-1.5">
						{data.map((site) => (
							<a
								key={site.domain}
								href={`${config.url}/${site.domain}`}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center justify-between p-2 rounded-md hover:bg-accent transition-colors group"
							>
								<div className="flex flex-col gap-0.5">
									<span className="text-sm font-medium flex items-center gap-1.5">
										{site.domain}
										<ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
									</span>
									<span className="text-xs text-muted-foreground">
										{site.visitors.toLocaleString()} visitors •{" "}
										{site.pageviews.toLocaleString()} pageviews
									</span>
								</div>
							</a>
						))}
					</div>
				</div>
			)}
		</div>
	);
};
