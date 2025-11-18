import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import type { Service } from "~/lib/db/schema";
import { queryClient } from "~/lib/store";

export const MonitorService = ({
	service,
}: {
	service: Pick<Service, "id" | "url">;
}) => {
	const healthQuery = useQuery(
		{
			queryKey: ["health-status"],
			queryFn: actions.health,
			select: (res) => {
				if (res.error) throw res.error;
				return res.data;
			},
			retry: false,
			refetchInterval: 1000 * 3,
		},
		queryClient,
	);
	const pingQuery = useQuery(
		{
			queryKey: ["service-ping", service.url],
			queryFn: () => actions.service.ping({ url: service.url }),
			select: (res) => {
				if (res.error) throw res.error;
				return res.data;
			},
			retry: false,
		},
		queryClient,
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
