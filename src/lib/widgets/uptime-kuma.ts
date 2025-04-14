export const parseMonitorStatusFromMetrics = (metricsContent: string) => {
	const lines = metricsContent.split("\n");
	const parsedData = [];

	for (const line of lines) {
		const trimmedLine = line.trim();

		if (trimmedLine.startsWith("monitor_status")) {
			const match = trimmedLine.match(
				/^monitor_status\{monitor_name="([^"]*)",monitor_type="([^"]*)",monitor_url="([^"]*)",monitor_hostname="([^"]*)",monitor_port="([^"]*)"\}\s+(\d+)$/,
			);
			if (match && match.length === 7) {
				parsedData.push({
					monitor_name: match[1],
					monitor_type: match[2],
					monitor_url: match[3],
					monitor_hostname: match[4],
					monitor_port: match[5],
					status: Number.parseInt(match[6] ?? "0", 10),
				});
			} else {
				console.warn(`Skipping malformed line: ${trimmedLine}`);
			}
		}
	}

	return parsedData;
};
