##### DEPENDENCIES

FROM oven/bun:1.1.38-alpine AS deps
# RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install --frozen-lockfile

##### BUILDER

FROM oven/bun:1.1.38-alpine AS builder
ARG DATABASE_URL
ARG NEXT_PUBLIC_CLIENTVAR
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN bun run build

##### RUNNER

FROM oven/bun:1.1.38-distroless AS runner
WORKDIR /app

ENV NODE_ENV=production

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV DATABASE_PATH=/app/db/db.sqlite

CMD ["server.js"]
