import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";

type Props = {
	config: Extract<WIDGETS, { type: "beszel" }>["config"];
};

export const BeszelWidget = ({ config }: Props) => {
	const beszelQuery = useQuery(
		{
			queryKey: ["widget", "beszel", config],
			queryFn: () => actions.widget.beszel(config),
			select: (res) => {
				if (res.error) throw new Error(res.error.message);
				return res.data;
			},
			refetchInterval: 5000,
		},
		queryClient,
	);

	if (beszelQuery.isLoading) {
		return <div>Loading...</div>;
	}

	if (beszelQuery.isError || !beszelQuery.data) {
		return <div>Error</div>;
	}

	return (
		<Table className="w-[500px]">
			<TableCaption className="hidden">Beszel systems</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead className="w-1/5">System</TableHead>
					<TableHead className="w-1/5">CPU</TableHead>
					<TableHead className="w-1/5">Memory</TableHead>
					<TableHead className="w-1/5">Disk</TableHead>
					<TableHead className="w-1/5">Temperature</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{beszelQuery.data.map((system) => (
					<TableRow key={system.id}>
						<TableCell className="font-medium">{system.name}</TableCell>
						<TableCell>{system.info.cpuUsagePercent}%</TableCell>
						<TableCell>{system.info.memoryUsagePercent}%</TableCell>
						<TableCell>{system.info.diskUsagePercent}%</TableCell>
						<TableCell>
							{system.info.temperature ? `${system.info.temperature}°C` : "N/A"}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
