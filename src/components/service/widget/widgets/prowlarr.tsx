import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";

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
		<div className="max-w-[300px]">
			<div>
				<span className="font-bold">{data.activeIndexers}</span> active indexers
				out of <span className="font-bold">{data.totalIndexers}</span> total
			</div>
			<div className="grid gap-2 text-sm mt-1">
				{healthIssues.length > 0 && (
					<div>
						{healthIssues.map((issue) => (
							<div
								key={`${issue.source}-${issue.message}`}
								className={
									issue.type === "error" ? "text-red-500" : "text-yellow-500"
								}
							>
								{issue.type === "error" ? "🚨" : "⚠️"}{" "}
								<span className="font-semibold">{issue.source}</span>:{" "}
								{issue.message}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};
