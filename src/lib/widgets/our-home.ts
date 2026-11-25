import { tryCatch } from "~/lib/try-catch"
import type { WidgetConfig } from "~/lib/widgets"

type OurHomeSummaryResponse = {
  dogday: {
    dogCount: number
    primaryDog: {
      id: string
      name: string
      accent: string | null
    } | null
    lastWalkAt: string | null
    lastPottyAt: string | null
    lastPottyType: "pee" | "poo" | null
    lastFeedingAt: string | null
    lastFeedingGrams: number | null
  }
  subs: {
    count: number
    currency: string
    currencySymbol: string
    totalPerMonth: number
    totalThisMonth: number
    remainingThisMonth: number
    upcoming: Array<{
      id: number
      name: string
      price: number
      nextPaymentDate: string
      image: string | null
    }>
  }
}

export const getWidgetData = async (config: WidgetConfig<"our-home">) => {
  const baseUrl = config.url.replace(/\/+$/, "")

  const res = await tryCatch(
    fetch(`${baseUrl}/api/v1/summary`, {
      headers: {
        "x-api-key": config.apiKey,
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch Our Home summary: ${response.statusText}`)
      }
      return response.json() as Promise<OurHomeSummaryResponse>
    }),
  )

  if (res.error) {
    throw res.error
  }

  const { dogday, subs } = res.data

  return {
    dogday: {
      dogCount: dogday.dogCount,
      primaryDog: dogday.primaryDog
        ? {
            id: dogday.primaryDog.id,
            name: dogday.primaryDog.name,
          }
        : null,
      url: dogday.primaryDog
        ? `${baseUrl}/dogday/${encodeURIComponent(dogday.primaryDog.id)}`
        : `${baseUrl}/dogday`,
      lastWalkAt: dogday.lastWalkAt,
      lastPottyAt: dogday.lastPottyAt,
      lastPottyType: dogday.lastPottyType,
      lastFeedingAt: dogday.lastFeedingAt,
      lastFeedingGrams: dogday.lastFeedingGrams,
    },
    subs: {
      url: `${baseUrl}/subs`,
      count: subs.count,
      currency: subs.currency,
      currencySymbol: subs.currencySymbol,
      totalPerMonth: subs.totalPerMonth,
      totalThisMonth: subs.totalThisMonth,
      remainingThisMonth: subs.remainingThisMonth,
      upcoming: subs.upcoming.slice(0, 3).map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        nextPaymentDate: item.nextPaymentDate,
      })),
    },
  }
}
