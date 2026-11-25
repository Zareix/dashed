import { useQuery } from "@tanstack/react-query"
import { actions } from "astro:actions"
import {
  CreditCardIcon,
  DropletsIcon,
  ExternalLinkIcon,
  FootprintsIcon,
  PawPrintIcon,
  UtensilsIcon,
} from "lucide-react"

import { queryClient } from "~/lib/store"
import type { WIDGETS } from "~/lib/widgets"

type Props = {
  config: Extract<WIDGETS, { type: "our-home" }>["config"]
}

const formatRelativeCompact = (iso: string | null): string => {
  if (!iso) return "—"
  const timestamp = Date.parse(iso)
  if (!Number.isFinite(timestamp)) return "—"

  const diffMinutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60_000))
  if (diffMinutes < 1) return "<1m"
  if (diffMinutes < 60) return `${diffMinutes}m`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}j`
}

const formatPrice = (amount: number, currencySymbol: string): string =>
  `${new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)} ${currencySymbol}`

const formatUpcomingDate = (iso: string): string => {
  const date = new Date(iso)
  if (!Number.isFinite(date.getTime())) return "—"

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const targetStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  const diffDays = Math.round((targetStart - todayStart) / 86_400_000)

  if (diffDays <= 0) return "Aujourd'hui"
  if (diffDays === 1) return "Demain"
  if (diffDays <= 6) return `Dans ${diffDays}j`

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
  }).format(date)
}

export const OurHomeWidget = ({ config }: Props) => {
  const { isLoading, data, isError } = useQuery(
    {
      queryKey: ["widget", "our-home", config],
      queryFn: () => actions.widget["our-home"](config),
      select: (res) => {
        if (res.error) throw new Error(res.error.message)
        return res.data
      },
    },
    queryClient,
  )

  if (isLoading) {
    return <div>Chargement...</div>
  }

  if (isError || !data) {
    return <div>Erreur</div>
  }

  const { dogday, subs } = data
  const pottyLabel =
    dogday.lastPottyType === "pee" ? "Pipi" : dogday.lastPottyType === "poo" ? "Caca" : null

  return (
    <div className="w-88 space-y-3 text-sm">
      {/* DogDay */}
      <div className="space-y-1.5">
        <a
          href={dogday.url}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-between rounded-md px-1.5 py-1 transition-colors hover:bg-accent"
        >
          <span className="flex items-center gap-1.5 font-medium">
            <PawPrintIcon className="size-3.5 text-orange-500" />
            {dogday.primaryDog ? dogday.primaryDog.name : "DogDay"}
            <ExternalLinkIcon className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </span>
        </a>

        {dogday.primaryDog ? (
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <div className="flex flex-col gap-0.5 rounded-md bg-muted/50 px-2 py-1.5">
              <span className="flex items-center gap-1 text-muted-foreground">
                <FootprintsIcon className="size-3 shrink-0" />
                Balade
              </span>
              <span className="font-mono font-medium">
                {formatRelativeCompact(dogday.lastWalkAt)}
              </span>
            </div>

            <div className="flex flex-col gap-0.5 rounded-md bg-muted/50 px-2 py-1.5">
              <span className="flex items-center gap-1 text-muted-foreground">
                <DropletsIcon className="size-3 shrink-0" />
                Besoin
              </span>
              <span className="truncate font-mono font-medium">
                {dogday.lastPottyAt && pottyLabel
                  ? `${pottyLabel} · ${formatRelativeCompact(dogday.lastPottyAt)}`
                  : "—"}
              </span>
            </div>

            <div className="flex flex-col gap-0.5 rounded-md bg-muted/50 px-2 py-1.5">
              <span className="flex items-center gap-1 text-muted-foreground">
                <UtensilsIcon className="size-3 shrink-0" />
                Repas
              </span>
              <span className="truncate font-mono font-medium">
                {dogday.lastFeedingAt
                  ? `${Math.round(dogday.lastFeedingGrams ?? 0)}g · ${formatRelativeCompact(dogday.lastFeedingAt)}`
                  : "—"}
              </span>
            </div>
          </div>
        ) : (
          <p className="px-1.5 text-xs text-muted-foreground">Aucun chien configuré</p>
        )}
      </div>

      {/* Abonnements */}
      <div className="space-y-2 border-t pt-2.5">
        <a
          href={subs.url}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-between rounded-md px-1.5 py-1 transition-colors hover:bg-accent"
        >
          <span className="flex items-center gap-1.5 font-medium">
            <CreditCardIcon className="size-3.5 text-violet-500" />
            Abonnements
            <ExternalLinkIcon className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {formatPrice(subs.totalPerMonth, subs.currencySymbol)}/mois
          </span>
        </a>

        <div className="grid grid-cols-2 gap-1.5 text-xs">
          <div className="flex flex-col gap-0.5 rounded-md bg-muted/50 px-2 py-1.5">
            <span className="text-muted-foreground">Ce mois-ci</span>
            <span className="font-mono font-medium">
              {formatPrice(subs.totalThisMonth, subs.currencySymbol)}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 rounded-md bg-muted/50 px-2 py-1.5">
            <span className="text-muted-foreground">Restant ce mois</span>
            <span className="font-mono font-medium">
              {formatPrice(subs.remainingThisMonth, subs.currencySymbol)}
            </span>
          </div>
        </div>

        {subs.upcoming.length > 0 && (
          <div className="space-y-1 px-1 text-xs">
            <p className="text-[11px] font-medium text-muted-foreground">Prochains prélèvements</p>
            {subs.upcoming.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-2">
                <span className="truncate">{item.name}</span>
                <span className="shrink-0 font-mono text-muted-foreground">
                  {formatUpcomingDate(item.nextPaymentDate)} ·{" "}
                  <span className="text-foreground">
                    {formatPrice(item.price, subs.currencySymbol)}
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
