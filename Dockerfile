FROM oven/bun:1 AS base

# Build client
FROM base AS client-build
WORKDIR /app/client
COPY client/package.json client/bun.lock ./
RUN bun install --frozen-lockfile
COPY client/ .
COPY shared/ /app/shared/
RUN bun run build

# Runtime sidecar
FROM base AS runtime
WORKDIR /app
COPY sidecar/package.json sidecar/bun.lock ./sidecar/
RUN cd sidecar && bun install --frozen-lockfile --production
COPY sidecar/ ./sidecar/
COPY shared/ ./shared/
COPY --from=client-build /app/client/build ./client/build

EXPOSE 11111
CMD ["bun", "run", "sidecar/src/index.ts"]
