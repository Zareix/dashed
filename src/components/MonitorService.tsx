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

	if (pingQuery.isLoading || pingQuery.data) return <></>;

	return (
		<div className="text-red-500 absolute top-1/2 -translate-y-1/2 right-2">
			❌
		</div>
	);
};

export default MonitorService;
