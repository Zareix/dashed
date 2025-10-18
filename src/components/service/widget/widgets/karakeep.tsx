import type { WIDGETS } from "~/lib/widgets";
import { api } from "~/trpc/react";

type Props = {
	config: Extract<WIDGETS, { type: "karakeep" }>["config"];
};

export const KarakeepWidget: React.FC<Props> = ({ config }) => {
	const { data, isError, isLoading } = api.widget.karakeep.useQuery(config);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError || !data) {
		return <div>Error</div>;
	}

	return (
		<div className="max-w-[300px]">
			<div
				className="grid gap-2 [&>div]:flex [&>div]:gap-1 [&>div]:rounded-md
		 [&>div]:text-center [&>div>div]:font-medium"
			>
				<div>
					<div>{data.bookmarksCount}</div>
					<p>total bookmarks</p>
				</div>
				{data.lists.map((list) => (
					<div key={list.id}>
						<div>{list.bookmarksCount}</div>
						<p>
							in{" "}
							<a
								href={`${config.url}/dashboard/lists/${list.id}`}
								className="font-medium"
							>
								{list.icon} {list.name}
							</a>
						</p>
					</div>
				))}
			</div>
		</div>
	);
};
