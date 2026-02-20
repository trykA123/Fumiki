# Stage 1: Build the client assets
FROM oven/bun:alpine AS builder
WORKDIR /app

# Copy root manifest and workspace package.json files
COPY package.json bun.lock ./
COPY client/package.json ./client/
COPY sidecar/package.json ./sidecar/
COPY shared/package.json ./shared/

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source files
COPY . .

# Build SvelteKit static client
RUN cd client && bun run build

# Stage 2: Runtime Environment
FROM oven/bun:alpine AS runner
WORKDIR /app

# The target data directory for sqlite and backups inside the container
ENV DATA_DIR=/app/data
ENV PORT=3000
ENV NODE_ENV=production

# Install production dependencies only if strictly needed (Bun caches a lot)
COPY package.json bun.lock ./
COPY sidecar/package.json ./sidecar/
COPY shared/package.json ./shared/

# Skip installing dev dependencies or client dependencies
RUN bun install --frozen-lockfile --production

# Copy built client artifacts
COPY --from=builder /app/client/build ./client/build

# Copy runtime sidecar files
COPY sidecar ./sidecar
COPY shared ./shared

# Create the data directory for docker volumes to mount onto
RUN mkdir -p /app/data && chown -R bun:bun /app/data

# Run as non-root user built into oven/bun
USER bun

EXPOSE 3000

# Start server
CMD ["bun", "run", "sidecar/src/index.ts"]
