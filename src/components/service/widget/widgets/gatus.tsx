import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";

type Props = {
	config: Extract<WIDGETS, { type: "gatus" }>["config"];
};

export const GatusWidget = ({ config }: Props) => {
	const { data, isError, isLoading } = useQuery(
		{
			queryKey: ["widget", "gatus", config],
			queryFn: () => actions.widget.gatus(config),
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

	const upServices = data.filter((service) => service.success);
	const downServices = data.filter((service) => !service.success);

	return (
		<div className="max-w-[300px]">
			<div className="grid min-w-[150px] grid-cols-2 gap-2 text-sm [&>div>p]:mt-auto [&>div>p]:font-medium [&>div]:flex [&>div]:flex-col [&>div]:rounded-md [&>div]:text-center [&>div]:text-base">
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
				<div className="mt-1 border-t pt-1 text-center">
					🚨 {downServices.map((x) => `${x.group}/${x.name}`).join(", ")}
				</div>
			)}
		</div>
	);
};
