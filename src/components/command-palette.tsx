import { useQueries, useQuery } from "@tanstack/react-query"
import { actions } from "astro:actions"
import { useEffect, useMemo, useState } from "react"

import type { CommandList as CommandListType } from "~/actions/command"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command"
import { Kbd, KbdGroup } from "~/components/ui/kbd"
import { queryClient } from "~/lib/store"

function mergeCommandLists(lists: CommandListType[]): CommandListType {
  const merged: CommandListType = {}
  for (const list of lists) {
    for (const [group, items] of Object.entries(list)) {
      merged[group] = merged[group] ? [...merged[group], ...items] : items
    }
  }
  return merged
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null)
  const [isMetaPressed, setIsMetaPressed] = useState(false)
  const baseCommandsQuery = useQuery(
    {
      queryKey: ["commands"],
      queryFn: actions.command.getBaseCommands,
      select: (res) => {
        if (res.error) throw new Error(res.error.message)
        return res.data
      },
    },
    queryClient,
  )

  const serviceIdsWithDetails = useMemo(() => {
    const ids = new Set<number>()
    for (const items of Object.values(baseCommandsQuery.data ?? {})) {
      for (const item of items) {
        if (item.serviceId) ids.add(item.serviceId)
      }
    }
    return [...ids]
  }, [baseCommandsQuery.data])

  const allWidgetCommandsQueries = useQueries(
    {
      queries: serviceIdsWithDetails.map((serviceId) => ({
        queryKey: ["commands", serviceId],
        queryFn: () => actions.command.getWidgetCommands(serviceId),
        select: (res: Awaited<ReturnType<typeof actions.command.getWidgetCommands>>) => {
          if (res.error) throw new Error(res.error.message)
          return res.data
        },
        enabled: open,
        retry: false,
      })),
    },
    queryClient,
  )

  const widgetCommandsQuery = useQuery(
    {
      queryKey: ["commands", selectedServiceId],
      queryFn: () => {
        if (!selectedServiceId) throw new Error("No service selected")
        return actions.command.getWidgetCommands(selectedServiceId)
      },
      select: (res) => {
        if (res.error) throw new Error(res.error.message)
        return res.data
      },
      enabled: !!selectedServiceId,
    },
    queryClient,
  )

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const isValidUrl = (url: string): boolean => {
    try {
      const parsed = new URL(url, window.location.origin)
      return parsed.protocol === "http:" || parsed.protocol === "https:"
    } catch {
      return false
    }
  }

  const navigate = (url: string) => {
    if (isValidUrl(url)) {
      window.location.href = url
    } else {
      console.error("Invalid URL:", url)
    }
  }

  const filter = (value: string, search: string, keywords?: string[]) => {
    let score = 0
    if (keywords?.some((k) => k.toLowerCase().includes(search.toLowerCase()))) {
      return 1
    }
    if (score > 0 && value.startsWith("service-")) score += 1
    return score
  }

  const isLoading = selectedServiceId ? widgetCommandsQuery.isLoading : baseCommandsQuery.isLoading
  const isError = selectedServiceId ? widgetCommandsQuery.isError : baseCommandsQuery.isError
  const commands = selectedServiceId
    ? widgetCommandsQuery.data
    : baseCommandsQuery.data &&
      mergeCommandLists([
        baseCommandsQuery.data,
        ...allWidgetCommandsQueries.flatMap((q) => (q.data ? [q.data] : [])),
      ])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command
        filter={filter}
        onKeyDown={(e) => {
          if (e.key === "Escape" || (e.key === "Backspace" && !search)) {
            e.preventDefault()
            setSelectedServiceId(null)
          }
          if (e.key === "Meta" || e.key === "Control") {
            setIsMetaPressed(true)
          }
        }}
        onKeyUp={(e) => {
          if (e.key === "Meta" || e.key === "Control") {
            setIsMetaPressed(false)
          }
        }}
      >
        <CommandInput
          placeholder="Type a command or search..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          {isLoading ? (
            <div>Fetching widget commands…</div>
          ) : isError || !commands ? (
            <CommandEmpty>Error loading commands.</CommandEmpty>
          ) : (
            <>
              <CommandEmpty>No results found.</CommandEmpty>
              {Object.entries(commands).map(([cg, commandList]) => (
                <CommandGroup heading={cg} key={cg}>
                  {commandList.map((c) => (
                    <CommandItem
                      key={c.id}
                      value={c.id}
                      keywords={[c.name]}
                      onSelect={() => {
                        if (isMetaPressed && c.serviceId) {
                          setSelectedServiceId(c.serviceId)
                          setSearch("")
                        } else {
                          navigate(c.url)
                          setOpen(false)
                        }
                      }}
                    >
                      <div className="flex items-center gap-1">
                        {c.icon && (
                          <img src={c.icon} alt={c.name} className="h-4 w-4 object-contain" />
                        )}
                        <span>{c.name}</span>
                        {c.serviceName && (
                          <span className="text-xs opacity-50">{c.serviceName}</span>
                        )}
                      </div>
                      <div className="ml-auto flex items-center gap-1">
                        {c.information && <span className="opacity-50">{c.information}</span>}
                        {c.serviceId && (
                          <div className="text-muted-foreground">
                            <KbdGroup>
                              <Kbd>⌘ + Enter</Kbd>
                            </KbdGroup>{" "}
                            to open details
                          </div>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
