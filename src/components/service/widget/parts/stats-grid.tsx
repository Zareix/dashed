import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

type Stat = {
	value: ReactNode;
	label: string;
	icon?: LucideIcon;
};

type Props = {
	title?: string;
	stats: Stat[];
};

export const StatsGridWidgetPart = ({
	stats,
	title,
	className,
	...props
}: React.ComponentProps<"div"> & Props) => {
	const getColClassName = () => {
		const count = stats.length;
		if (count === 1) return "grid-cols-1";
		if (count === 2) return "grid-cols-2";
		if (count === 4) return "grid-cols-2";
		return "grid-cols-3";
	};

	return (
		<>
			{title && <h3 className="mb-2 text-center font-medium">{title}</h3>}
			<div
				className={cn("grid gap-4", getColClassName(), className)}
				{...props}
			>
				{stats.map((stat) => (
					<div key={stat.label} className="flex flex-col text-center">
						{stat.icon ? (
							<div className="flex items-center justify-center gap-1 font-mono">
								<stat.icon size={16} />
								<span>{stat.value}</span>
							</div>
						) : (
							<div className="font-mono">{stat.value}</div>
						)}

						<p className="mt-auto font-medium">{stat.label}</p>
					</div>
				))}
			</div>
		</>
	);
};
