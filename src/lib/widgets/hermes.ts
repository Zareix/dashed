import { tryCatch } from "~/lib/try-catch"
import type { WidgetConfig } from "~/lib/widgets"

type HermesDetailedHealthResponse = {
  status: string
  readiness: {
    status: string
    checks: Record<
      string,
      {
        status: string
        used_percent?: number
        state?: string
        connected_platforms?: number
        platforms?: number
        active_api_runs?: number
        active_delegations?: number
      }
    >
  }
  version: string
  gateway_state: string
}

type HermesJobsResponse = {
  jobs: Array<{
    id: string
    name: string
    schedule_display?: string
    enabled: boolean
    state: string
    next_run_at?: string | null
    last_status?: string | null
    failure_streak: number
  }>
}

type HermesSessionsResponse = {
  data: Array<{
    id: string
    title: string
    source: string
    message_count: number
    /** Epoch Unix en SECONDES (float), pas en millisecondes. */
    last_active: number | string
    started_at: number | string
    model: string
    actual_cost_usd: number
    archived: boolean
    pinned: boolean
    hidden: boolean
    parent_session_id: string | null
  }>
  limit: number
  offset: number
  has_more: boolean
}

/**
 * L'API Hermes renvoie `last_active` / `started_at` en epoch **secondes** (float).
 * `new Date(n)` attend des millisecondes : sans conversion on obtient 1970.
 * Une chaîne ISO est acceptée telle quelle.
 */
const toIsoDate = (value: number | string | null | undefined): string | null => {
  if (value === null || value === undefined) return null
  const ms = typeof value === "number" ? value * 1000 : Date.parse(value)
  return Number.isFinite(ms) ? new Date(ms).toISOString() : null
}

export const getWidgetData = async (config: WidgetConfig<"hermes">) => {
  const [healthRes, jobsRes, sessionsRes] = await Promise.all([
    tryCatch(
      fetch(`${config.url}/health/detailed`, {
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
        },
      }).then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch Hermes health: ${res.statusText}`)
        }
        return res.json() as Promise<HermesDetailedHealthResponse>
      }),
    ),
    tryCatch(
      fetch(`${config.url}/api/jobs`, {
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
        },
      }).then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch Hermes jobs: ${res.statusText}`)
        }
        return res.json() as Promise<HermesJobsResponse>
      }),
    ),
    tryCatch(
      fetch(`${config.url}/api/sessions?limit=6`, {
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
        },
      }).then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch Hermes sessions: ${res.statusText}`)
        }
        return res.json() as Promise<HermesSessionsResponse>
      }),
    ),
  ])
  if (healthRes.error) {
    throw healthRes.error
  }
  if (jobsRes.error) {
    throw jobsRes.error
  }

  const sessions = (sessionsRes.data?.data ?? [])
    .filter((session) => !session.hidden && !session.archived)
    .map((session) => ({
      id: session.id,
      title: session.title,
      source: session.source,
      messageCount: session.message_count,
      model: session.model,
      lastActive: toIsoDate(session.last_active),
      href: config.webuiUrl
        ? `${config.webuiUrl}/session/${encodeURIComponent(session.id)}`
        : null,
    }))

  const health = healthRes.data
  const jobs = jobsRes.data.jobs ?? []
  const checks = health.readiness.checks ?? {}
  const disk = checks.disk
  const gateway = checks.gateway
  const queues = checks.background_queues

  return {
    health: {
      status: health.status,
      version: health.version,
      gatewayState: health.gateway_state,
      connectedPlatforms: gateway?.connected_platforms ?? 0,
      totalPlatforms: gateway?.platforms ?? 0,
      activeRuns: queues?.active_api_runs ?? 0,
      activeDelegations: queues?.active_delegations ?? 0,
      diskUsedPercent: disk?.used_percent ?? 0,
      failedChecks: Object.entries(checks)
        .filter(([, check]) => check.status !== "ok")
        .map(([name]) => name),
    },
    jobs: jobs.map((job) => ({
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
