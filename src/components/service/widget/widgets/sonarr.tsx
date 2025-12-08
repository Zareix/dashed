import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { ExternalLinkIcon } from "lucide-react";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";

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

	if (Object.keys(data.missingSeriesEpisodes).length === 0) {
		return <div>No missing episodes</div>;
	}

	return (
		<div className="text-sm grid gap-1 max-w-[300px]">
			{Object.entries(data.missingSeriesEpisodes)
				.sort((a, b) => a[1].title.localeCompare(b[1].title))
				.map(([seriesId, series]) => (
					<div key={seriesId}>
						<a
							href={series.url}
							className="group underline flex items-center gap-1"
							target="_blank"
							rel="noreferrer"
						>
							<span className="whitespace-nowrap max-w-64 overflow-hidden text-ellipsis">
								{series.title}
							</span>
							<ExternalLinkIcon size={10} />
						</a>
						<div>
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
					</div>
				))}
		</div>
	);
};

export default SonarrWidget;
