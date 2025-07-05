import type { WIDGETS } from "~/lib/widgets";
import { api } from "~/utils/api";

type Props = {
	config: Extract<WIDGETS, { type: "uptime-kuma" }>["config"];
};

const UptimeKumaWidget = ({ config }: Props) => {
	const { data, isError, isLoading } = api.widget.uptimeKuma.useQuery({
		url: config.url,
		apiKey: config.apiKey,
	});

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError || !data) {
		return <div>Error</div>;
	}

	if (data.metrics.length === 0) {
		return <div>No missing episodes</div>;
	}

	const upServices = data.metrics.filter((service) => service.status === 1);
	const downServices = data.metrics.filter((service) => service.status === 0);

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
					🚨 {downServices.map((x) => x.monitor_name).join(", ")}
				</div>
			)}
		</div>
	);
};

export default UptimeKumaWidget;
