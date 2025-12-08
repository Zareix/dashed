import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { ExternalLinkIcon } from "lucide-react";
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
		<div className="max-w-[300px] grid gap-1 text-sm">
			{data.missingMovies.map((movie) => (
				<a
					key={movie.id}
					href={movie.url}
					className="group no-underline flex items-center gap-1"
					target="_blank"
					rel="noreferrer"
				>
					<span className="whitespace-nowrap w-64 overflow-hidden text-ellipsis">
						{movie.title}
					</span>
					<ExternalLinkIcon size={10} />
				</a>
			))}
		</div>
	);
};
