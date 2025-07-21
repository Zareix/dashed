import type { WIDGETS } from "~/lib/widgets";
import { api } from "~/utils/api";

type Props = {
	config: Extract<WIDGETS, { type: "nextdns" }>["config"];
};

export const NextDNSWidget = ({ config }: Props) => {
	const { isLoading, data, isError } = api.widget.nextdns.useQuery({
		profile: config.profile,
		apiKey: config.apiKey,
	});

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError || !data) {
		return <div>Error</div>;
	}

	const percentageBlocked = data.blocked
		? ((data.blocked / (data.default + data.blocked)) * 100).toFixed(2)
		: "0.00";

	return (
		<div className="max-w-[300px]">
			<div
				className="grid grid-cols-3 gap-4 [&>div]:bg-background [&>div]:rounded-md [&>div]:flex [&>div]:flex-col
		 [&>div]:text-center [&>div>p]:font-medium [&>div>p]:mt-auto"
			>
				<div>
					<div>{data.default}</div>
					<p>Total</p>
				</div>
				<div>
					<div>{data.blocked}</div>
					<p>Blocked</p>
				</div>
				<div>
					<div>{percentageBlocked}%</div>
					<p>% Blocked</p>
				</div>
			</div>
		</div>
	);
};
