import type { WIDGETS } from "~/lib/widgets";
import { api } from "~/trpc/react";

type Props = {
	config: Extract<WIDGETS, { type: "cup" }>["config"];
};

const CupWidget = ({ config }: Props) => {
	const { isLoading, data, isError } = api.widget.cup.useQuery({
		url: config.url,
		onlyInUse: config.onlyInUse,
	});

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError || !data) {
		return <div>Error</div>;
	}

	return (
		<div
			className="grid grid-cols-3 gap-2 text-sm [&>div]:bg-background [&>div]:rounded-md [&>div]:flex [&>div]:flex-col
		 [&>div]:text-center [&>div>p]:font-medium [&>div>p]:mt-auto w-[300px]"
		>
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

export default CupWidget;
