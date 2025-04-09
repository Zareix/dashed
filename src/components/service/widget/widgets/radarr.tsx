import type { WIDGETS } from "~/lib/widgets";
import { api } from "~/utils/api";

type Props = {
	config: Extract<WIDGETS, { type: "radarr" }>["config"];
};

const RadarrWidget = ({ config }: Props) => {
	const { isLoading, data, isError } = api.widget.radarr.useQuery(config);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError || !data) {
		return <div>Error</div>;
	}

	if (data.missingMovies.length === 0) {
		return <div>No missing movies</div>;
	}

	return (
		<div className="text-sm grid gap-1">
			{data.missingMovies.map((movie) => (
				<div key={movie.id} className="font-bold">
					{movie.title}
				</div>
			))}
		</div>
	);
};

export default RadarrWidget;
