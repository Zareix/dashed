import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Download, Upload } from "lucide-react";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";

type Props = {
	config: Extract<WIDGETS, { type: "qbittorrent" }>["config"];
};

export const QBittorrentWidget = ({ config }: Props) => {
	const { isLoading, data, isError } = useQuery(
		{
			queryKey: ["widget", "qbittorrent", config],
			queryFn: () => actions.widget.qbittorrent(config),
			select: (res) => {
				if (res.error) throw new Error(res.error.message);
				return res.data;
			},
			refetchInterval: 3000,
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
		<div className="w-[250px]">
			<div className="grid grid-cols-2 gap-4 [&>div>p]:mt-auto [&>div>p]:font-medium [&>div]:flex [&>div]:flex-col [&>div]:rounded-md [&>div]:text-center">
				<div>
					<div className="flex items-center justify-center gap-1">
						<ArrowDown size={16} />
						<span>{data.downloadSpeed}</span>
					</div>
					<p>Down Speed</p>
				</div>
				<div>
					<div className="flex items-center justify-center gap-1">
						<ArrowUp size={16} />
						<span>{data.uploadSpeed}</span>
					</div>
					<p>Up Speed</p>
				</div>
				<div>
					<div className="flex items-center justify-center gap-1">
						<Download size={16} />
						<span>{data.downloadData}</span>
					</div>
					<p>Downloaded</p>
				</div>
				<div>
					<div className="flex items-center justify-center gap-1">
						<Upload size={16} />
						<span>{data.uploadData}</span>
					</div>
					<p>Uploaded</p>
				</div>
			</div>
		</div>
	);
};
