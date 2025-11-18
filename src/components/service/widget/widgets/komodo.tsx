import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";

type Props = {
	config: Extract<WIDGETS, { type: "komodo" }>["config"];
};

export const KomodoWidget = ({ config }: Props) => {
	const { isLoading, data, isError } = useQuery(
		{
			queryKey: ["widget", "komodo", config],
			queryFn: () => actions.widget.komodo(config),
			select: (res) => {
				if (res.error) throw new Error(res.error.message);
				return res.data;
			},
		},
		queryClient,
	);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError || !data) {
		return <div>Error</div>;
	}

	const serversDown = data.servers.filter((server) => server.state !== "Ok");
	const stacksDown = data.stacks.filter(
		(stack) =>
			stack.state === "down" ||
			stack.state === "unhealthy" ||
			stack.state === "stopped" ||
			stack.state === "dead" ||
			stack.state === "unknown",
	);

	return (
		<div className="max-w-[300px]">
			<div
				className="grid grid-cols-2 gap-4 [&>div]:rounded-md [&>div]:flex [&>div]:flex-col
		 [&>div]:text-center [&>div>p]:font-medium [&>div>p]:mt-auto"
			>
				<div>
					<div>{data.servers.length}</div>
					<p>Servers</p>
				</div>
				<div>
					<div>{data.stacks.length}</div>
					<p>Stacks</p>
				</div>
			</div>
			<div className="grid gap-2 text-sm">
				{serversDown.length > 0 && (
					<div className="mt-4 text-red-500">
						🚨 Servers:{" "}
						{serversDown.map((server, index) => (
							<a href={`${config.url}/servers/${server.id}`} key={server.id}>
								{server.name} ({server.state})
								{index < serversDown.length - 1 ? ", " : ""}
							</a>
						))}
					</div>
				)}
				{stacksDown.length > 0 && (
					<div className="text-red-500 ">
						🚨 Stacks:{" "}
						{stacksDown.map((stack, index) => (
							<a href={`${config.url}/stacks/${stack.id}`} key={stack.id}>
								{stack.name} ({stack.state})
								{index < stacksDown.length - 1 ? ", " : ""}
							</a>
						))}
					</div>
				)}
			</div>
		</div>
	);
};
