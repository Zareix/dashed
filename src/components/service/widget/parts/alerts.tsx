type HealthIssue = {
	source: string;
	type: string;
	message: string;
};

type Props = {
	alerts: HealthIssue[];
};

export const AlertsWidgetpart = ({ alerts }: Props) => {
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
					</div>
				))}
			</div>
		</div>
	);
};
