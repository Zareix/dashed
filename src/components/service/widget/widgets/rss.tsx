import { useQuery } from "@tanstack/react-query"
import { actions } from "astro:actions"
import { ExternalLinkIcon } from "lucide-react"

import { queryClient } from "~/lib/store"
import type { WIDGETS } from "~/lib/widgets"

type Props = {
  config: Extract<WIDGETS, { type: "rss" }>["config"]
}

const formatDate = (date: string | null) => {
  if (!date) return null
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}

export const RssWidget = ({ config }: Props) => {
  const { isLoading, data, isError } = useQuery(
    {
      queryKey: ["widget", "rss", config],
      queryFn: () => actions.widget.rss(config),
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

  return (
    <div className="grid max-w-75 gap-1">
      {data.items.map((item) => {
        const date = formatDate(item.date)
        return (
          <a
            key={item.link + item.title}
            href={item.link}
            className="group block rounded-md px-1.5 py-1 no-underline transition-colors hover:bg-accent"
            target="_blank"
            rel="noreferrer"
          >
            <span className="flex items-center gap-1 font-medium">
              <span className="truncate">{item.title}</span>
              <ExternalLinkIcon
                size={10}
                className="ml-auto shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
              />
            </span>
            {date && <span className="block truncate text-xs text-muted-foreground">{date}</span>}
            {item.description && (
              <span className="mt-0.5 line-clamp-2 text-xs text-muted-foreground/70">
                {item.description}
              </span>
            )}
          </a>
        )
      })}
    </div>
  )
}
