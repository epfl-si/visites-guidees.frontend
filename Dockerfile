# deps
FROM oven/bun:1-alpine AS deps
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

# Install serve outside /root (mode 700) so it runs under any non-root UID
ENV BUN_INSTALL_GLOBAL_DIR=/opt/bun-global
RUN bun install -g serve

RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3000

CMD ["/bin/sh", "./docker-entrypoint.sh"]
