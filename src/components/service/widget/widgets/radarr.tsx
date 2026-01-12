import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { ExternalLinkIcon } from "lucide-react";
import { AlertsWidgetpart } from "~/components/service/widget/parts/alerts";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";

type Props = {
	config: Extract<WIDGETS, { type: "radarr" }>["config"];
};

export const RadarrWidget = ({ config }: Props) => {
	const { isLoading, data, isError } = useQuery(
		{
			queryKey: ["widget", "radarr", config],
			queryFn: () => actions.widget.radarr(config),
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
		<div className="max-w-75">
			{data.missingMovies.length === 0 && (
				<div className="text-sm">No missing movies</div>
			)}
			<div className="grid gap-1 text-sm">
				{data.missingMovies.map((movie) => (
					<a
						key={movie.id}
						href={movie.url}
						className="group flex items-center gap-1 rounded-md px-1.5 py-1 no-underline transition-colors hover:bg-accent"
						target="_blank"
						rel="noreferrer"
					>
						<span className="w-64 overflow-hidden text-ellipsis whitespace-nowrap">
							{movie.title}
						</span>
						<ExternalLinkIcon
							size={10}
							className="opacity-0 transition-opacity group-hover:opacity-100"
						/>
					</a>
				))}
			</div>
			<AlertsWidgetpart alerts={data.allHealth} />
		</div>
	);
};
