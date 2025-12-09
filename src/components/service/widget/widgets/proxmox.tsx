import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import {
	AlertTriangle,
	Container,
	ExternalLink,
	HardDrive,
	Server,
} from "lucide-react";
import { queryClient } from "~/lib/store";
import { formatBytes } from "~/lib/utils";
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

	const stoppedVMs = data.flatMap((node) =>
		node.vms.filter((vm) => vm.status !== "running"),
	);
	const stoppedLXCs = data.flatMap((node) =>
		node.lxcs.filter((lxc) => lxc.status !== "running"),
	);
	const inaccessibleStorage = data.flatMap((node) => node.inaccessibleStorage);
	const hasAlerts =
		stoppedVMs.length > 0 ||
		stoppedLXCs.length > 0 ||
		inaccessibleStorage.length > 0;

	return (
		<div className="max-w-[400px]">
			{hasAlerts && (
				<div className="mb-2 p-2 rounded-md bg-yellow-500/10 border border-yellow-500/20">
					<div className="flex items-center gap-2">
						<AlertTriangle size={16} className="text-yellow-500 mt-0.5" />
						<div className="flex-1 text-xs space-y-1">
							{stoppedVMs.length > 0 && (
								<div className="text-yellow-600 dark:text-yellow-400">
									<p className="font-medium">Stopped VMs:</p>
									<p>
										{stoppedVMs
											.map((vm) => vm.name || `VM-${vm.vmid}`)
											.join(", ")}
									</p>
								</div>
							)}
							{stoppedLXCs.length > 0 && (
								<div className="text-yellow-600 dark:text-yellow-400">
									<p className="font-medium">Stopped LXCs:</p>
									<p>
										{stoppedLXCs
											.map((lxc) => lxc.name || `LXC-${lxc.vmid}`)
											.join(", ")}
									</p>
								</div>
							)}
							{inaccessibleStorage.length > 0 && (
								<div className="text-yellow-600 dark:text-yellow-400">
									<p className="font-medium">Inaccessible Storage:</p>
									<p>{inaccessibleStorage.join(", ")}</p>
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{data.length > 0 && (
				<div className="space-y-1.5">
					{data.map((node) => {
						const nodeRunningVms = node.vms.filter(
							(vm) => vm.status === "running",
						);
						const nodeRunningLxcs = node.lxcs.filter(
							(lxc) => lxc.status === "running",
						);

						return (
							<div key={node.node} className="space-y-1">
								<a
									href={`${config.url}/#v1:0:=node%2F${node.node}`}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center justify-between p-2 rounded-md hover:bg-accent transition-colors group"
								>
									<div className="flex flex-col gap-0.5 flex-1">
										<span className="text-sm font-medium flex items-center gap-1.5">
											{node.node}
											<ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
										</span>
										<span className="text-xs text-muted-foreground">
											<span className="inline-flex items-center gap-1">
												<Server size={12} />
												{nodeRunningVms.length}/{node.vms.length} VMs
											</span>
											{" • "}
											<span className="inline-flex items-center gap-1">
												<Container size={12} />
												{nodeRunningLxcs.length}/{node.lxcs.length} LXCs
											</span>
										</span>
										<span className="text-xs text-muted-foreground inline-flex items-center gap-1">
											<HardDrive size={12} />
											{formatBytes(node.storageUsed)} /{" "}
											{formatBytes(node.storageTotal)} ({node.storagePercent}
											%)
										</span>
									</div>
								</a>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};
