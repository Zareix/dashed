import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { ExternalLinkIcon } from "lucide-react";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";
import { AlertsWidgetPart } from "../parts/alerts";

type Props = {
	config: Extract<WIDGETS, { type: "sonarr" }>["config"];
};

const SonarrWidget = ({ config }: Props) => {
	const { isLoading, data, isError } = useQuery(
		{
			queryKey: ["widget", "sonarr", config],
			queryFn: () => actions.widget.sonarr(config),
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
			{Object.keys(data.missingSeriesEpisodes).length === 0 && (
				<div className="text-sm">No missing episodes</div>
			)}
			<div className="grid gap-0.5 text-sm">
				{Object.entries(data.missingSeriesEpisodes)
					.sort((a, b) => a[1].title.localeCompare(b[1].title))
					.map(([seriesId, series]) => (
						<a
							key={seriesId}
							href={series.url}
							className="group rounded-md px-1.5 py-1 transition-colors hover:bg-accent"
							target="_blank"
							rel="noreferrer"
						>
							<div className="flex items-center gap-1">
								<span className="max-w-64 overflow-hidden text-ellipsis whitespace-nowrap">
									{series.title}
								</span>
								<ExternalLinkIcon
									size={10}
									className="opacity-0 transition-opacity group-hover:opacity-100"
								/>
							</div>
							<div className="text-muted-foreground text-xs">
								{series.episodes
									.sort((a, b) => {
										if (a.seasonNumber === b.seasonNumber) {
											return a.episodeNumber - b.episodeNumber;
										}
										return a.seasonNumber - b.seasonNumber;
									})
									.map(
										(episode) =>
											`S${episode.seasonNumber}E${episode.episodeNumber}`,
									)
									.join(", ")}
							</div>
						</a>
					))}
			</div>

			<AlertsWidgetPart alerts={healthIssues} />
		</div>
	);
};

export default SonarrWidget;
