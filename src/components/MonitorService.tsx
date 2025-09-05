"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import type { Service } from "~/server/db/schema";
import { api } from "~/trpc/react";

const MonitorService = ({
	service,
}: {
	service: Pick<Service, "id" | "url">;
}) => {
	const healthQuery = api.health.health.useQuery(undefined, {
		retry: false,
		refetchInterval: 1000 * 3,
	});
	const pingQuery = api.service.ping.useQuery(
		{
			url: service.url,
		},
		{
			retry: false,
		},
	);

	useEffect(() => {
		if (healthQuery.isPending) return;
		if (healthQuery.isSuccess && healthQuery.data?.status === "ok") {
			toast.dismiss();
			return;
		}

		toast.error("Unable to connect to the server", {
			duration: Number.POSITIVE_INFINITY,
			id: "health-error",
		});
	}, [healthQuery.data, healthQuery.isPending, healthQuery.isSuccess]);

	if (
		pingQuery.isLoading ||
		pingQuery.data ||
		pingQuery.isFetching ||
		pingQuery.isPaused ||
		healthQuery.data?.status !== "ok"
	)
		return null;

	return <div className="ping-error" />;
};

export default MonitorService;
