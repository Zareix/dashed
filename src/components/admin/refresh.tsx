"use client";

import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export const RefreshButton = () => {
	const refreshIndexPageMutation = api.service.refresh.useMutation({
		onSuccess: async () => {
			toast.success("Index page refreshed");
		},
		onError: () => {
			toast.error("An error occurred while refreshing index page");
		},
	});

	const refresh = () => {
		refreshIndexPageMutation.mutate();
	};
	return <Button onClick={refresh}>Refresh homepage</Button>;
};
