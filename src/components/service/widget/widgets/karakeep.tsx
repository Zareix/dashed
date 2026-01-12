import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { ExternalLinkIcon } from "lucide-react";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";

type Props = {
	config: Extract<WIDGETS, { type: "karakeep" }>["config"];
};

export const KarakeepWidget: React.FC<Props> = ({ config }) => {
	const { isLoading, isError, data } = useQuery(
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

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError || !data) {
		return <div>Error</div>;
	}

	return (
		<div className="grid max-w-75 gap-1">
			{data.lists.map((list) => (
				<a
					key={list.id}
					href={list.url}
					className="group flex items-center gap-1 rounded-md px-1.5 py-1 font-medium no-underline transition-colors hover:bg-accent"
					target="_blank"
					rel="noreferrer"
				>
					{list.icon} {list.name}
					<ExternalLinkIcon
						size={10}
						className="ml-auto opacity-0 transition-opacity group-hover:opacity-100"
					/>
				</a>
			))}
		</div>
	);
};
