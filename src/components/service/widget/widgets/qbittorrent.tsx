import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Download, Upload } from "lucide-react";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";
import { StatsGridWidgetPart } from "../parts/stats-grid";

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
		<div className="w-62.5">
			<StatsGridWidgetPart
				stats={[
					{
						value: data.downloadSpeed,
						icon: ArrowDown,
						label: "Down Speed",
					},
					{
						value: data.uploadSpeed,
						icon: ArrowUp,
						label: "Up Speed",
					},
					{
						value: data.downloadData,
						icon: Download,
						label: "Downloaded",
					},
					{
						value: data.uploadData,
						icon: Upload,
						label: "Uploaded",
					},
				]}
			/>
		</div>
	);
};
