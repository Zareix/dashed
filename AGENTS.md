# AGENTS.md

Dashed is a self-hosted homelab dashboard: dead simple to set up, with an admin
interface to edit the dashboard. Runs as a compiled Bun binary in a distroless
Docker image.

## Stack

- **Runtime / package manager**: Bun (use `bun` for everything, never npm/pnpm)
- **Framework**: Astro 7 in SSR mode (`output: "server"`, Node standalone adapter)
- **UI**: React 19 (React Compiler enabled — avoid manual memoization) +
  Tailwind CSS 4 (CSS-based config in `src/styles/global.css`, no
  `tailwind.config`) + Base UI primitives (shadcn "base-vega" style) + lucide icons
- **Data**: Drizzle ORM over `bun:sqlite`, migrations in `drizzle/`
- **Client data fetching**: TanStack Query; server mutations via Astro Actions
- **Language**: TypeScript, strict; path alias `~/` → `src/`

## Commands

```sh
bun run dev          # dev server
bun run build        # build to dist/
bun run compile      # compile dist/server/entry.mjs into standalone ./dashed binary
bun run preview      # run the built server
bun run lint         # oxlint
bun run lint:fix     # oxlint --fix
bun run format       # oxfmt
bun run check        # format + lint:fix + astro check  ← run before committing
bun run db:generate  # generate SQL migration from src/lib/db/schema.ts changes
bun run db:push      # push schema directly (dev only)
bun run db:studio    # Drizzle Studio
```

`bun run check` must pass before a change is considered done.

## Architecture

```
src/
├── pages/            # Astro pages (index.astro = dashboard, admin.astro)
├── layouts/          # Layout.astro
├── actions/          # Astro Actions (server): category, service, widget, command, import-export
├── lib/
│   ├── db/           # Drizzle client + schema (category, service tables)
│   ├── widgets/      # Per-widget server code: <type>.ts exports getWidgetData(config)
│   │   └── index.ts # Zod schemas + WIDGETS discriminated union (source of truth for widget types)
│   ├── schema.ts     # Zod schemas for action inputs
│   ├── store.ts      # queryClient + shared client state
│   └── try-catch.ts  # tryCatch helper — use it for fetches/promises
└── components/
    ├── ui/           # shadcn-style Base UI primitives
    ├── category/     # category CRUD + reorder UI
    ├── service/      # service CRUD, cards, monitor
    │   └── widget/widgets/  # per-widget React components (client rendering)
    └── admin/        # admin panel, import/export
```

**Data flow for a widget**: the React component (`src/components/service/widget/widgets/<type>.tsx`)
calls `actions.widget.<type>(config)` through `useQuery`; the action validates
the config with the widget's Zod schema and delegates to `getWidgetData` in
`src/lib/widgets/<type>.ts`, which fetches from the third-party service
server-side (secrets never reach the browser).

**Database**: the Drizzle client (`src/lib/db/index.ts`) applies all migrations
from `./drizzle/` automatically on startup. After changing
`src/lib/db/schema.ts`, generate a migration with `bun run db:generate` and
commit the SQL file. `db.sqlite*` files at the repo root are local dev
artifacts — never commit them. `DATABASE_PATH` env var sets the DB location.

## Adding a widget (checklist)

1. **Schema**: add `<type>Schema` in `src/lib/widgets/index.ts` and register it
   in the `WIDGETS` discriminated union. Reuse `baseConfig` / `withApiKey` /
   `withUserPass` when possible. Use `.describe()` on user-facing fields.
2. **Server fetcher**: create `src/lib/widgets/<type>.ts` exporting
   `getWidgetData(config: WidgetConfig<"type">)`. Use `tryCatch` for network
   calls, throw a descriptive `Error` on failure.
3. **Action**: register it in `src/actions/widget.ts`
   (`input: <type>Schema.shape.config, handler: <type>.getWidgetData`).
   Kebab-case action names are quoted (`"pocket-id"`, `"uptime-kuma"`).
4. **Client component**: create
   `src/components/service/widget/widgets/<type>.tsx`, a named export using
   `useQuery` + `actions.widget.<type>`, with `queryKey: ["widget", "<type>", config]`
   and the shared `queryClient` from `~/lib/store`. Render a `Loading...` and
   `Error` fallback.
5. **Form**: if the widget has config fields, add it to the widget config form
   (`src/components/service/widget/form-config.tsx`).
6. Run `bun run check`.

## Conventions

- Imports: `~/...` alias; type-only imports use `import type`.
- Zod: import from `"astro/zod"`; action inputs are always validated with Zod.
- Files: kebab-case for widget modules, PascalCase for React components
  (`uptime-kuma.ts` ↔ `UptimeKumaWidget`).
- Error handling: `tryCatch` from `~/lib/try-catch` for promises; widget
  fetchers throw plain `Error` with a clear message.
- Bun APIs are welcome where they help (`Bun.XML.parse`, `bun:sqlite`, etc.).
- Commit style: conventional commits (`feat:`, `fix:`, `chore:`), plus separate
  `bump version` commits updating `package.json` version on release.

## Deployment

Pushes to `main` trigger GitHub Actions: version is read from `package.json`,
Docker image is built (multi-stage: bun install → astro build → `bun run
compile` → distroless runner) and published to `ghcr.io/zareix/dashed`, then a
release is created. PRs run lint + a non-pushed Docker build. Renovate keeps
deps up to date.
