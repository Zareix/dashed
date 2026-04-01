import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { AlertsWidgetPart } from "~/components/service/widget/parts/alerts";
import { queryClient } from "~/lib/store";
import type { WIDGETS } from "~/lib/widgets";
import { StatsGridWidgetPart } from "../parts/stats-grid";

type Props = {
	config: Extract<WIDGETS, { type: "arcane" }>["config"];
};

export const ArcaneWidget = ({ config }: Props) => {
	const { isLoading, data, isError } = useQuery(
		{
			queryKey: ["widget", "arcane", config],
			queryFn: () => actions.widget.arcane(config),
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

	const environmentsDown = data.environments.filter(
		(environment) =>
			environment.status === "partially running" ||
			environment.status === "stopped",
	);
	const projectsDown = data.projects.filter(
		(project) =>
			project.status === "partially running" || project.status === "stopped",
	);

	const alerts: React.ComponentProps<typeof AlertsWidgetPart>["alerts"] = [];
	if (environmentsDown.length > 0) {
		alerts.push({
			type: "error",
			source: `${environmentsDown.length} environment(s) down`,
			message: environmentsDown
				.map((environment) => `${environment.name} (${environment.status})`)
				.join(", "),
		});
	}
	if (projectsDown.length > 0) {
		alerts.push({
			type: "error",
			source: `${projectsDown.length} project(s) down`,
			message: projectsDown
				.map((project) => `${project.name} (${project.status})`)
				.join(", "),
		});
	}

	return (
		<div className="max-w-75">
			<StatsGridWidgetPart
				stats={[
					{
						value: data.environments.length,
						label: "Environments",
					},
					{
						value: data.projects.length,
						label: "Projects",
					},
				]}
			/>
			<AlertsWidgetPart alerts={alerts} />
		</div>
	);
};
