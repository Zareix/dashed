import type { z } from "zod";
import type { WIDGETS } from "~/lib/widgets";
import { api } from "~/utils/api";

type Props = {
	config: Extract<WIDGETS, { type: "sonarr" }>["config"];
};

const SonarrWidget = ({ config }: Props) => {
	const { isLoading, data, isError } = api.widget.sonarr.useQuery(config);

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
		<div className="text-sm grid gap-1">
			{Object.entries(data.missingSeriesEpisodes).map(([seriesId, series]) => (
				<div key={seriesId}>
					<div className="font-bold">{series.seriesTitle}</div>
					<div>
						{series.episodes
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
