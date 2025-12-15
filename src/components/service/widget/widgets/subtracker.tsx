import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";

type Props = {
	config: Extract<WIDGETS, { type: "subtracker" }>["config"];
};

export const SubtrackerWidget = ({ config }: Props) => {
	const { isLoading, data, isError } = useQuery(
		{
			queryKey: ["widget", "subtracker", config],
			queryFn: () => actions.widget.subtracker(config),
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
		<div className="max-w-[300px]">
			<div className="grid gap-2 [&>div>div]:font-medium [&>div]:flex [&>div]:gap-1 [&>div]:rounded-md [&>div]:text-center">
				<div>
					<div>
						{data.stats.totalThisMonth}
						{data.currency.symbol}
					</div>
					<p>total this month</p>
				</div>
				<div>
					<div>
						{data.stats.remainingThisMonth}
						{data.currency.symbol}
					</div>
					<p>remaining this month</p>
				</div>
				<div>
					<div>
						{data.stats.expectedNextMonth}
						{data.currency.symbol}
					</div>
					<p>expected next month</p>
				</div>
			</div>
		</div>
	);
};
