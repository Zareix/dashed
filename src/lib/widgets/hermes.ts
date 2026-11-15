import { tryCatch } from "~/lib/try-catch"
import type { WidgetConfig } from "~/lib/widgets"

// Réponses de l'API du dashboard Hermes (`hermes dashboard`, port 9119).
type HermesStatusResponse = {
  version: string
  overall: string
  gateway_state: string | null
  components: Record<
    string,
    {
      status: string
      state?: string
      connected?: number
      configured?: number
    }
  >
  disk?: {
    used_percent?: number
  }
}

type HermesCronJob = {
  id: string
  name: string
  schedule_display?: string
  enabled: boolean
  state: string
  next_run_at?: string | null
  last_status?: string | null
  failure_streak: number
}

type HermesSessionsResponse = {
  sessions: Array<{
    id: string
    title: string
    source: string
    message_count: number
    /** Epoch Unix en SECONDES (float), pas en millisecondes. */
    last_active: number | string
    started_at: number | string
    model: string
    archived: boolean
    pinned: boolean
  }>
  total: number
}

/**
 * Le dashboard renvoie `last_active` / `started_at` en epoch **secondes** (float).
 * `new Date(n)` attend des millisecondes : sans conversion on obtient 1970.
 * Une chaîne ISO est acceptée telle quelle.
 */
const toIsoDate = (value: number | string | null | undefined): string | null => {
  if (value === null || value === undefined) return null
  const ms = typeof value === "number" ? value * 1000 : Date.parse(value)
  return Number.isFinite(ms) ? new Date(ms).toISOString() : null
}

const fetchDashboard = <T>(config: WidgetConfig<"hermes">, path: string, label: string) =>
  tryCatch(
    fetch(`${config.url}${path}`, {
      // `HERMES_DASHBOARD_SESSION_TOKEN` du dashboard, pas l'API_SERVER_KEY.
      headers: { "X-Hermes-Session-Token": config.apiKey },
    }).then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch Hermes ${label}: ${res.statusText}`)
      }
      return res.json() as Promise<T>
    }),
  )

export const getWidgetData = async (config: WidgetConfig<"hermes">) => {
  const [statusRes, jobsRes, sessionsRes] = await Promise.all([
    fetchDashboard<HermesStatusResponse>(config, "/api/status", "status"),
    fetchDashboard<HermesCronJob[]>(config, "/api/cron/jobs", "jobs"),
    fetchDashboard<HermesSessionsResponse>(
      config,
      "/api/sessions?limit=4&order=recent",
      "sessions",
    ),
  ])
  if (statusRes.error) {
    throw statusRes.error
  }
  if (jobsRes.error) {
    throw jobsRes.error
  }

  const sessions = (sessionsRes.data?.sessions ?? [])
    .filter((session) => !session.archived && !session.pinned)
    .map((session) => ({
      id: session.id,
      title: session.title,
      source: session.source,
      messageCount: session.message_count,
      model: session.model,
      lastActive: toIsoDate(session.last_active),
      href: config.webuiUrl ? `${config.webuiUrl}/#/${encodeURIComponent(session.id)}` : null,
    }))

  const status = statusRes.data
  const components = status.components ?? {}
  const platforms = components.platforms

  return {
    health: {
      status: status.overall,
      version: status.version,
      gatewayState: status.gateway_state ?? "stopped",
      connectedPlatforms: platforms?.connected ?? 0,
      totalPlatforms: platforms?.configured ?? 0,
      diskUsedPercent: status.disk?.used_percent ?? 0,
      failedChecks: Object.entries(components)
        .filter(([, component]) => component.status !== "ok")
        .map(([name]) => name),
    },
    jobs: (jobsRes.data ?? []).map((job) => ({
      id: job.id,
      name: job.name,
      schedule: job.schedule_display ?? "",
      enabled: job.enabled,
      state: job.state,
      nextRunAt: job.next_run_at ?? null,
      lastStatus: job.last_status ?? null,
      failureStreak: job.failure_streak,
    })),
    sessions,
  }
}
