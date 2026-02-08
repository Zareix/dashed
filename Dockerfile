##### DEPENDENCIES
FROM oven/bun:1.3.9-debian AS deps
WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

##### BUILDER
FROM oven/bun:1.3.9-debian AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV ASTRO_TELEMETRY_DISABLED=1

RUN bun run build;

RUN bun run compile

##### RUNNER
FROM gcr.io/distroless/base-debian13 AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/dist/client ./dist/client
COPY --from=builder /app/dashed ./dashed

EXPOSE 3000
ENV HOST=0.0.0.0
ENV PORT=3000
ENV DATABASE_PATH=/app/db/db.sqlite

CMD ["./dashed"]
