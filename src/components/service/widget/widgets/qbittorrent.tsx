import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Download, Upload } from "lucide-react";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";

type Props = {
	config: Extract<WIDGETS, { type: "qbittorrent" }>["config"];
};

const formatBytes = (bytes: number): string => {
	if (bytes < 0) return "0 B";
	if (bytes === 0) return "0 B";
	const k = 1024;
	const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
	const i = Math.min(
		Math.floor(Math.log(bytes) / Math.log(k)),
		sizes.length - 1,
	);
	return `${(bytes / k ** i).toFixed(2)} ${sizes[i]}`;
};

const formatSpeed = (bytesPerSecond: number): string => {
	return `${formatBytes(bytesPerSecond)}/s`;
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
			refetchInterval: 5000, // Refresh every 5 seconds for real-time data
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
		<div className="w-[270px]">
			<div
				className="grid grid-cols-2 gap-4 [&>div]:rounded-md [&>div]:flex [&>div]:flex-col
		 [&>div]:text-center [&>div>p]:font-medium [&>div>p]:mt-auto"
			>
				<div>
					<div className="flex items-center justify-center gap-1">
						<ArrowDown size={16} />
						<span>{formatSpeed(data.downloadSpeed)}</span>
					</div>
					<p>Down Speed</p>
				</div>
				<div>
					<div className="flex items-center justify-center gap-1">
						<ArrowUp size={16} />
						<span>{formatSpeed(data.uploadSpeed)}</span>
					</div>
					<p>Up Speed</p>
				</div>
				<div>
					<div className="flex items-center justify-center gap-1">
						<Download size={16} />
						<span>{formatBytes(data.downloadData)}</span>
					</div>
					<p>Downloaded</p>
				</div>
				<div>
					<div className="flex items-center justify-center gap-1">
						<Upload size={16} />
						<span>{formatBytes(data.uploadData)}</span>
					</div>
					<p>Uploaded</p>
				</div>
			</div>
		</div>
	);
};
