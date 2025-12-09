import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { Container, HardDrive, Server } from "lucide-react";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";

type Props = {
	config: Extract<WIDGETS, { type: "proxmox" }>["config"];
};

export const ProxmoxWidget = ({ config }: Props) => {
	const { isLoading, data, isError } = useQuery(
		{
			queryKey: ["widget", "proxmox", config],
			queryFn: () => actions.widget.proxmox(config),
			select: (res) => {
				if (res.error) throw new Error(res.error.message);
				return res.data;
			},
			refetchInterval: 5000,
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
			<div className="grid grid-cols-2 gap-4 [&>div]:rounded-md [&>div]:flex [&>div]:flex-col [&>div]:text-center [&>div>p]:font-medium [&>div>p]:mt-auto">
				<div>
					<div className="flex items-center justify-center gap-1">
						<Server size={16} />
						<span>
							{data.runningVms}/{data.totalVms}
						</span>
					</div>
					<p>VMs</p>
				</div>
				<div>
					<div className="flex items-center justify-center gap-1">
						<Container size={16} />
						<span>
							{data.runningLxcs}/{data.totalLxcs}
						</span>
					</div>
					<p>LXCs</p>
				</div>
				<div className="col-span-2">
					<div className="flex items-center justify-center gap-1">
						<HardDrive size={16} />
						<span>
							{data.storageUsed} / {data.storageTotal}
						</span>
					</div>
					<p>Storage ({data.storagePercent}%)</p>
				</div>
			</div>
		</div>
	);
};
