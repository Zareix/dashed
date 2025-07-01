import type { Service } from "~/server/db/schema";
import { api } from "~/utils/api";

const MonitorService = ({
	service,
}: {
	service: Pick<Service, "id" | "url">;
}) => {
	const pingQuery = api.service.ping.useQuery(
		{
			url: service.url,
		},
		{
			retry: false,
		},
	);

	if (
		pingQuery.isLoading ||
		pingQuery.data ||
		pingQuery.isFetching ||
		pingQuery.isPaused
	)
		return <></>;

	return <div className="ping-error" />;
};

export default MonitorService;
