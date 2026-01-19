import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { StatsGridWidgetPart } from "~/components/service/widget/parts/stats-grid";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";

type Props = {
	config: Extract<WIDGETS, { type: "pocket-id" }>["config"];
};

const PocketIdWidget = ({ config }: Props) => {
	const { data, isError, isLoading } = useQuery(
		{
			queryKey: ["widget", "pocket-id", config],
			queryFn: () => actions.widget["pocket-id"](config),
			select: (res) => {
				if (res.error) throw new Error(res.error.message);
				return res.data;
			},
		},
		queryClient,
	);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError || !data) {
		return <div>Error</div>;
	}

	const formatLastSignIn = (dateString: string | undefined) => {
		if (!dateString) {
			return "Never";
		}
		try {
			const date = new Date(dateString);
			const now = new Date();
			const diffMs = now.getTime() - date.getTime();
			const diffMins = Math.floor(diffMs / 60000);
			const diffHours = Math.floor(diffMs / 3600000);
			const diffDays = Math.floor(diffMs / 86400000);

			if (diffMins < 1) return "Just now";
			if (diffMins < 60) return `${diffMins}m ago`;
			if (diffHours < 24) return `${diffHours}h ago`;
			if (diffDays < 7) return `${diffDays}d ago`;

			return date.toLocaleDateString();
		} catch {
			return dateString;
		}
	};

	return (
		<div className="max-w-75">
			<StatsGridWidgetPart
				stats={[
					{
						label: "OIDC Clients",
						value: data.oidcClients,
					},
					{
						label: "Users",
						value: data.users,
					},
					{
						label: "Last Sign-in",
						value: formatLastSignIn(data.lastSignIn),
					},
				]}
			/>
		</div>
	);
};

export default PocketIdWidget;
