import type { WIDGETS } from "~/lib/widgets";
import { api } from "~/trpc/react";

type Props = {
	config: Extract<WIDGETS, { type: "gatus" }>["config"];
};

const GatusWidget = ({ config }: Props) => {
	const { data, isError, isLoading } = api.widget.gatus.useQuery({
		url: config.url,
	});

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError || !data) {
		return <div>Error</div>;
	}

	const upServices = data.filter((service) => service.success);
	const downServices = data.filter((service) => !service.success);

	return (
		<div className="max-w-[300px]">
			<div
				className="grid grid-cols-2 gap-2 text-sm [&>div]:bg-background [&>div]:rounded-md [&>div]:flex [&>div]:flex-col
		 [&>div]:text-center [&>div]:text-base [&>div>p]:font-medium [&>div>p]:mt-auto min-w-[150px]"
			>
				<div>
					<div>{upServices.length}</div>
					<p>Up</p>
				</div>
				<div>
					<div>{downServices.length}</div>
					<p>Down</p>
				</div>
			</div>
			{downServices.length > 0 && (
				<div className="border-t mt-1 pt-1 text-center">
					🚨 {downServices.map((x) => `${x.group}/${x.name}`).join(", ")}
				</div>
			)}
		</div>
	);
};

export default GatusWidget;
