import { Badge } from "~/components/ui/badge";

type HealthIssue = {
	source: string;
	type: "error" | "warning" | "info" | (string & {});
	message?: string;
	items?: string[];
};

type Props = {
	alerts: HealthIssue[];
};

export const AlertsWidgetPart = ({ alerts }: Props) => {
	if (alerts.length === 0) {
		return null;
	}

	const getAlertSymbol = (type: string) => {
		switch (type) {
			case "error":
				return "🚨";
			case "warning":
				return "⚠️";
			default:
				return "ℹ️";
		}
	};

	const sortedAlerts = [...alerts].sort((a, b) => {
		if (a.type === b.type) {
			return a.source.localeCompare(b.source);
		}
		return a.type.localeCompare(b.type);
	});

	return (
		<div className="mt-1 grid gap-2 text-sm">
			<div>
				{sortedAlerts.map((alert) => (
					<div
						key={`${alert.source}-${alert.message}`}
						className={
							alert.type === "error" ? "text-red-500" : "text-yellow-500"
						}
					>
						{getAlertSymbol(alert.type)}{" "}
						<span className="font-semibold">{alert.source}</span>:{" "}
						{alert.message}
						{alert.items && alert.items.length > 0 && (
							<div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
								{alert.items.map((x) => (
									<Badge key={x} variant="destructive">
										{x}
									</Badge>
								))}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};
