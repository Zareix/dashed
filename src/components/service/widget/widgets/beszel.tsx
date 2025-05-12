import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import type { WIDGETS } from "~/lib/widgets";
import { api } from "~/utils/api";

type Props = {
	config: Extract<WIDGETS, { type: "beszel" }>["config"];
};

const BeszelWidget = ({ config }: Props) => {
	const { isLoading, data, isError } = api.widget.beszel.useQuery({
		url: config.url,
		email: config.email,
		password: config.password,
	});

	const rounded = (num: number) => Math.round(num * 10) / 10;

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError || !data) {
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
				{data.map((system) => (
					<TableRow key={system.id}>
						<TableCell className="font-medium">{system.name}</TableCell>
						<TableCell>{rounded(system.info.cpuUsagePercent)}%</TableCell>
						<TableCell>{rounded(system.info.memoryUsagePercent)}%</TableCell>
						<TableCell>{rounded(system.info.diskUsagePercent)}%</TableCell>
						<TableCell>{rounded(system.info.temperature)}°C</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default BeszelWidget;
