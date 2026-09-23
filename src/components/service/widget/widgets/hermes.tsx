import { useQuery } from "@tanstack/react-query"
import { actions } from "astro:actions"

import { AlertsWidgetPart } from "~/components/service/widget/parts/alerts"
import { queryClient } from "~/lib/store"
import type { WIDGETS } from "~/lib/widgets"

import { StatsGridWidgetPart } from "../parts/stats-grid"

type Props = {
  config: Extract<WIDGETS, { type: "hermes" }>["config"]
}

export const HermesWidget = ({ config }: Props) => {
  const { isLoading, data, isError } = useQuery(
    {
      queryKey: ["widget", "hermes", config],
      queryFn: () => actions.widget.hermes(config),
      select: (res) => {
        if (res.error) throw new Error(res.error.message)
        return res.data
      },
    },
    queryClient,
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !data) {
    return <div>Error</div>
  }

  const alerts: React.ComponentProps<typeof AlertsWidgetPart>["alerts"] = []
  if (data.health.status !== "ok" || data.health.failedChecks.length > 0) {
    alerts.push({
      type: "warning",
      source: "Readiness",
      items: data.health.failedChecks,
    })
  }
  if (data.health.gatewayState !== "running") {
    alerts.push({
      type: "error",
      source: "Gateway",
      message: data.health.gatewayState,
    })
  }
  const failedJobs = data.jobs.filter(
    (job) => job.failureStreak > 0 || (job.lastStatus !== null && job.lastStatus !== "ok"),
  )
  if (failedJobs.length > 0) {
    alerts.push({
      type: "error",
      source: "Jobs",
      items: failedJobs.map((job) => `${job.name} (${job.lastStatus})`),
    })
  }

  return (
    <div className="max-w-75">
      <StatsGridWidgetPart
        stats={[
          {
            value: data.jobs.length,
            label: "Jobs",
          },
          {
            value: data.health.activeRuns,
            label: "Runs",
          },
          {
            value: `${data.health.connectedPlatforms}/${data.health.totalPlatforms}`,
            label: "Platforms",
          },
        ]}
      />
      <AlertsWidgetPart alerts={alerts} />
      {data.sessions.length > 0 && (
        <div className="mt-1 grid gap-2 text-sm">
          {data.sessions.map(
            (session) =>
              session.href && (
                <a
                  key={session.id}
                  href={session.href}
                  className="group flex items-center gap-1 rounded-md px-1.5 py-1 no-underline transition-colors hover:bg-accent"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="grid">
                    <span className="font-medium">{session.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {session.source}
                      {session.lastActive
                        ? ` · ${new Date(session.lastActive).toLocaleString()}`
                        : ""}
                    </span>
                  </div>
                </a>
              ),
          )}
        </div>
      )}
    </div>
  )
}
