import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";

type Props = {
	config: Extract<WIDGETS, { type: "controld" }>["config"];
};

export const ControlDWidget = ({ config }: Props) => {
	const { isLoading, data, isError } = useQuery(
		{
			queryKey: ["widget", "controld", config],
			queryFn: () => actions.widget.controld(config),
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

	const percentageBlocked = data.blocked
		? data.blocked / (data.total + data.blocked)
		: 0;

	const numberFormatter = new Intl.NumberFormat(window.navigator.language, {
		style: "decimal",
	});
	const percentFormatter = new Intl.NumberFormat(window.navigator.language, {
		style: "percent",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});

	return (
		<div className="max-w-[300px]">
			<div className="grid grid-cols-3 gap-4 [&>div>p]:mt-auto [&>div>p]:font-medium [&>div]:flex [&>div]:flex-col [&>div]:rounded-md [&>div]:text-center">
				<div>
					<div>{numberFormatter.format(data.total)}</div>
					<p>Total</p>
				</div>
				<div>
					<div>{numberFormatter.format(data.blocked)}</div>
					<p>Blocked</p>
				</div>
				<div>
					<div>{percentFormatter.format(percentageBlocked)}</div>
					<p>% Blocked</p>
				</div>
			</div>
		</div>
	);
};
