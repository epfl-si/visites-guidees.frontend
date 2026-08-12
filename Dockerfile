# deps
FROM oven/bun:1-alpine AS deps
RUN bun install -g serve
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# build
FROM oven/bun:1-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# runner
FROM oven/bun:1-alpine AS runner
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/docker-entrypoint.sh ./docker-entrypoint.sh

RUN bun install -g serve

RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3000

CMD ["/bin/sh", "./docker-entrypoint.sh"]
