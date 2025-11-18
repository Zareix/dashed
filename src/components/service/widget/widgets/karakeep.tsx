import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { ExternalLinkIcon } from "lucide-react";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";

type Props = {
	config: Extract<WIDGETS, { type: "karakeep" }>["config"];
};

export const KarakeepWidget: React.FC<Props> = ({ config }) => {
	const karakeepQuery = useQuery(
		{
			queryKey: ["widget", "karakeep", config],
			queryFn: () => actions.widget.karakeep(config),
			select: (res) => {
				if (res.error) throw new Error(res.error.message);
				return res.data;
			},
		},
		queryClient,
	);

	if (karakeepQuery.isLoading) {
		return <div>Loading...</div>;
	}

	if (karakeepQuery.isError || !karakeepQuery.data) {
		return <div>Error</div>;
	}

	return (
		<div className="max-w-[300px] grid gap-1">
			<a
				href={`${config.url}/dashboard/favourites`}
				className="group no-underline font-medium flex items-center gap-1"
				target="_blank"
				rel="noreferrer"
			>
				⭐<span className="group-hover:underline">Favourites</span>
				<ExternalLinkIcon size={10} />
			</a>
			{karakeepQuery.data.lists.map((list) => (
				<a
					key={list.id}
					href={`${config.url}/dashboard/lists/${list.id}`}
					className="group no-underline font-medium flex items-center gap-1"
					target="_blank"
					rel="noreferrer"
				>
					{list.icon}
					<span className="group-hover:underline">{list.name}</span>
					<ExternalLinkIcon size={10} />
				</a>
			))}
		</div>
	);
};
