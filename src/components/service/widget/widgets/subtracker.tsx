import type { WIDGETS } from "~/lib/widgets";
import { api } from "~/trpc/react";

type Props = {
	config: Extract<WIDGETS, { type: "subtracker" }>["config"];
};

export const SubtrackerWidget = ({ config }: Props) => {
	const { isLoading, data, isError } = api.widget.subtracker.useQuery({
		url: config.url,
		apiKey: config.apiKey,
	});

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
