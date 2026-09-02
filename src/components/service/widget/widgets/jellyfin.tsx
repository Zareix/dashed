import { useQuery } from "@tanstack/react-query"
import { actions } from "astro:actions"
import { ExternalLinkIcon } from "lucide-react"

import { AlertsWidgetPart } from "~/components/service/widget/parts/alerts"
import { queryClient } from "~/lib/store"
import type { WIDGETS } from "~/lib/widgets"

type Props = {
  config: Extract<WIDGETS, { type: "jellyfin" }>["config"]
}

export const JellyfinWidget: React.FC<Props> = ({ config }) => {
  const { isLoading, isError, data } = useQuery(
    {
      queryKey: ["widget", "jellyfin", config],
      queryFn: () => actions.widget.jellyfin(config),
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
    <div className="w-full max-w-72 min-w-40">
      <div className="grid gap-1">
        {data.libraries.map((library) => (
          <a
            key={library.id}
            href={library.url}
            className="group flex items-center gap-1 rounded-md px-1.5 py-1 font-medium no-underline transition-colors hover:bg-accent"
            target="_blank"
            rel="noreferrer"
          >
            {library.icon} {library.name}
            <span className="mt-0.5 text-xs font-normal text-muted-foreground">
              {library.count}
            </span>
            <ExternalLinkIcon
              size={10}
              className="ml-auto opacity-0 transition-opacity group-hover:opacity-100"
            />
          </a>
        ))}
      </div>
      <AlertsWidgetPart alerts={data.sessions} />
    </div>
  )
}
