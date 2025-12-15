import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";

type Props = {
	config: Extract<WIDGETS, { type: "cup" }>["config"];
};

export const CupWidget = ({ config }: Props) => {
	const { isLoading, data, isError } = useQuery(
		{
			queryKey: ["widget", "cup", config],
			queryFn: () => actions.widget.cup(config),
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
		<div className="grid w-[300px] grid-cols-3 gap-2 text-sm [&>div>p]:mt-auto [&>div>p]:font-medium [&>div]:flex [&>div]:flex-col [&>div]:rounded-md [&>div]:text-center">
			<div>
				<div>{data.monitoredImages}</div>
				<p>Monitored</p>
			</div>
			<div>
				<div>{data.updatesAvailable}</div>
				<p>Updates</p>
			</div>
			<div>
				<div>{data.upToDate}</div>
				<p>Up to date</p>
			</div>
		</div>
	);
};
