"use client";
import { ExternalLinkIcon } from "lucide-react";
import type { WIDGETS } from "~/lib/widgets";
import { api } from "~/trpc/react";

type Props = {
	config: Extract<WIDGETS, { type: "karakeep" }>["config"];
};

export const KarakeepWidget: React.FC<Props> = ({ config }) => {
	const [data] = api.widget.karakeep.useSuspenseQuery(config);

	if (!data) {
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
			{data.lists.map((list) => (
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
