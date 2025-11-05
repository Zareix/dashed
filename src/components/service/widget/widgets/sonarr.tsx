"use client";

import type { WIDGETS } from "~/lib/widgets";
import { api } from "~/trpc/react";

type Props = {
	config: Extract<WIDGETS, { type: "sonarr" }>["config"];
};

const SonarrWidget = ({ config }: Props) => {
	const [data] = api.widget.sonarr.useSuspenseQuery(config);

	if (!data) {
		return <div>Error</div>;
	}

	if (Object.keys(data.missingSeriesEpisodes).length === 0) {
		return <div>No missing episodes</div>;
	}

	return (
		<div className="text-sm grid gap-1 max-w-[300px]">
			{Object.entries(data.missingSeriesEpisodes)
				.sort((a, b) => a[1].seriesTitle.localeCompare(b[1].seriesTitle))
				.map(([seriesId, series]) => (
					<div key={seriesId}>
						<div className="font-bold">{series.seriesTitle}</div>
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
