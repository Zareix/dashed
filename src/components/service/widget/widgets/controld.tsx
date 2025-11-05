"use client";
import type { WIDGETS } from "~/lib/widgets";
import { api } from "~/trpc/react";

type Props = {
	config: Extract<WIDGETS, { type: "controld" }>["config"];
};

export const ControlDWidget = ({ config }: Props) => {
	const { isLoading, data, isError } = api.widget.controld.useQuery({
		apiKey: config.apiKey,
	});

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
			<div
				className="grid grid-cols-3 gap-4 [&>div]:bg-background [&>div]:rounded-md [&>div]:flex [&>div]:flex-col
		 [&>div]:text-center [&>div>p]:font-medium [&>div>p]:mt-auto"
			>
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
