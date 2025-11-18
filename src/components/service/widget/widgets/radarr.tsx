import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
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

	if (data.missingMovies.length === 0) {
		return <div>No missing movies</div>;
	}

	return (
		<div className="text-sm grid gap-1 max-w-[300px]">
			{data.missingMovies.map((movie) => (
				<div key={movie.id} className="font-bold">
					{movie.title}
				</div>
			))}
		</div>
	);
};
