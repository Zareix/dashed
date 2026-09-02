import { tryCatch } from "~/lib/try-catch"
import type { WidgetConfig } from "~/lib/widgets"

type JellyfinLibraryResponse = {
  ItemId: string
  Name: string
  CollectionType?: string
}

type JellyfinItemsResponse = {
  TotalRecordCount: number
}

type JellyfinSession = {
  UserId: string
  UserName: string
  Client?: string
  DeviceName?: string
  PlayState?: {
    PositionTicks?: number
  }
  NowPlayingItem?: {
    Name: string
    SeriesName?: string
    Type: string
    RunTimeTicks?: number
  }
}

const jellyfinFetch = async <T>(config: WidgetConfig<"jellyfin">, path: string): Promise<T> => {
  const res = await tryCatch(
    fetch(`${config.url}${path}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `MediaBrowser Token="${config.apiKey}", Client="dashed", Device="dashed", DeviceId="${encodeURIComponent(Buffer.from("dashed").toString("base64"))}", Version="1.0.0"`,
      },
    }).then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch jellyfin data: ${res.statusText}`)
      }
      return res.json() as Promise<T>
    }),
  )
  if (res.error) {
    throw res.error
  }
  return res.data
}

const formatRuntime = (runTimeTicks?: number, positionTicks?: number) => {
  if (!runTimeTicks) {
    return null
  }
  const format = (ticks: number) => {
    const totalMinutes = Math.floor(ticks / 600000000)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return hours > 0 ? `${hours}h${minutes.toString().padStart(2, "0")}` : `${minutes}min`
  }
  if (positionTicks) {
    return `${format(positionTicks)} / ${format(runTimeTicks)}`
  }
  return format(runTimeTicks)
}

const collectionTypeEmojis: Record<string, string> = {
  movies: "🎬",
  tvshows: "📺",
  music: "🎵",
  books: "📚",
  musicvideos: "🎤",
  homevideos: "📹",
  boxsets: "📦",
  mixed: "🗂️",
}

const collectionTypePaths: Record<string, string> = {
  movies: "movies",
  tvshows: "tv",
}

export const getWidgetData = async (config: WidgetConfig<"jellyfin">) => {
  const [libraries, sessions] = await Promise.all([
    jellyfinFetch<JellyfinLibraryResponse[]>(config, "/Library/VirtualFolders"),
    jellyfinFetch<JellyfinSession[]>(config, "/Sessions"),
  ])

  const librariesWithCount = await Promise.all(
    libraries
      .toSorted((a, b) => a.Name.localeCompare(b.Name))
      .map(async (library) => {
        const count = await jellyfinFetch<JellyfinItemsResponse>(
          config,
          `/Items?ParentId=${library.ItemId}&Recursive=true&ExcludeItemTypes=folder&Limit=0`,
        )
        const collectionTypePath = collectionTypePaths[library.CollectionType ?? "mixed"]
        return {
          id: library.ItemId,
          name: library.Name,
          icon: collectionTypeEmojis[library.CollectionType ?? "mixed"] ?? "🗂️",
          count: count.TotalRecordCount,
          url: collectionTypePath
            ? `${config.url}/web/#/${collectionTypePath}?topParentId=${library.ItemId}`
            : undefined,
        }
      }),
  )

  const activeSessions = sessions
    .filter((session) => session.NowPlayingItem)
    .map((session) => {
      const media = session.NowPlayingItem
      const title =
        media?.Type === "Episode" && media.SeriesName
          ? `${media.SeriesName} - ${media.Name}`
          : (media?.Name ?? "Unknown")
      const client = session.Client ?? session.DeviceName ?? "Unknown"
      const time = media?.RunTimeTicks
        ? formatRuntime(media.RunTimeTicks, session.PlayState?.PositionTicks)
        : undefined
      return {
        source: `${session.UserName} (${client})`,
        type: "info" as const,
        message: `${title}${time ? ` (${time})` : ""}`,
      }
    })

  return {
    libraries: librariesWithCount,
    sessions: activeSessions,
  }
}
