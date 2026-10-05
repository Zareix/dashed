import { tryCatch } from "~/lib/try-catch"
import type { WidgetConfig } from "~/lib/widgets"

export type FeedItem = {
  title: string
  link: string
  date: string | null
  description: string | null
}

type CompactNode = string | Record<string, unknown>

const oneOrMany = (value: unknown): CompactNode[] => [value ?? []].flat() as CompactNode[]

const text = (value: unknown): string | null => {
  if (typeof value === "string") {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : null
  }
  if (value !== null && typeof value === "object" && "#text" in value) {
    return text((value as Record<string, unknown>)["#text"])
  }
  return null
}

const atomLink = (entry: Record<string, unknown>): string | null => {
  for (const link of oneOrMany(entry["link"])) {
    if (typeof link === "string") continue
    const href = link["@href"]
    if (typeof href !== "string") continue
    if (!("@rel" in link) || link["@rel"] === "alternate") return href
  }
  return null
}

const entryLink = (entry: Record<string, unknown>): string =>
  text(entry["link"]) ?? atomLink(entry) ?? ""

const stripHtml = (value: string): string | null => {
  const stripped = value
    .replaceAll(/<[^>]*>/g, " ")
    .replaceAll(/\s+/g, " ")
    .trim()
  return stripped.length > 0 ? stripped : null
}

const entryDescription = (entry: Record<string, unknown>): string | null =>
  stripHtml(
    text(entry["description"]) ??
      text(entry["summary"]) ??
      text(entry["content"]) ??
      text(entry["content:encoded"]) ??
      "",
  )

export const parseFeed = (input: Parameters<typeof Bun.XML.parse>[0]): FeedItem[] => {
  const doc = Bun.XML.parse(input) as Record<string, unknown>

  const root = (doc["rss"] ?? doc["feed"] ?? doc["rdf:RDF"]) as Record<string, unknown> | undefined
  if (!root) {
    throw new Error("No RSS or Atom feed found in document")
  }
  const channel = root["channel"]
  const items = oneOrMany(
    (typeof channel === "object" && channel !== null
      ? (channel as Record<string, unknown>)["item"]
      : root["entry"]) ?? root["item"],
  )

  return items.map((item) => {
    const entry = typeof item === "string" ? {} : item
    return {
      title: text(entry["title"]) ?? "Untitled",
      link: entryLink(entry),
      date:
        text(entry["pubDate"]) ??
        text(entry["published"]) ??
        text(entry["updated"]) ??
        text(entry["date"]) ??
        text(entry["dc:date"]),
      description: entryDescription(entry),
    }
  })
}

export const getWidgetData = async (config: WidgetConfig<"rss">) => {
  const parsedLimit = Number.parseInt(config.limit ?? "", 10)
  const limit = Number.isNaN(parsedLimit) || parsedLimit <= 0 ? 5 : Math.min(parsedLimit, 20)

  const res = await tryCatch(
    fetch(config.url, {
      headers: {
        Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
      },
    }).then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch RSS feed: ${res.statusText}`)
      }
      return res.arrayBuffer()
    }),
  )
  if (res.error) {
    throw res.error
  }

  let items: FeedItem[]
  try {
    items = parseFeed(res.data)
  } catch (error) {
    throw new Error(
      `Failed to parse RSS feed: ${error instanceof Error ? error.message : "unknown error"}`,
    )
  }
  return { items: items.slice(0, limit) }
}
