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

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError || !data) {
		return <div>Error</div>;
	}

	console.log(data);

	return (
		<Table className="w-[500px]">
			<TableCaption className="hidden">Beszel systems</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead className="w-1/4">System</TableHead>
					<TableHead className="w-1/4">CPU</TableHead>
					<TableHead className="w-1/4">Memory</TableHead>
					<TableHead className="w-1/4">Disk</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.items.map((system) => (
					<TableRow key={system.id}>
						<TableCell className="font-medium">{system.name}</TableCell>
						<TableCell>{system.info.cpu}%</TableCell>
						<TableCell>{system.info.mp}%</TableCell>
						<TableCell>{system.info.dp}%</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default BeszelWidget;
