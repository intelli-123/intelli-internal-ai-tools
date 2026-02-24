# ---------- 1) Dependencies layer ----------
FROM node:20-slim AS deps
WORKDIR /app

# Ensure predictable, fast installs
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# ---------- 2) Build layer ----------
FROM node:20-slim AS builder
WORKDIR /app

# Helpful in CI; silences telemetry prompts
ENV NEXT_TELEMETRY_DISABLED=1

# Copy deps and source
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# --- Diagnostics before building ---
RUN node -v && npm -v
# If you want even more logs, add: ENV NODE_OPTIONS="--trace-warnings"

# Build (verbose to surface the real error in the CI logs)
# NOTE: Next.js doesn't have a --verbose flag, but npm does; this makes npm show more context.
RUN npm run build --loglevel verbose

# ---------- 3) Runtime layer (Cloud Run) ----------
FROM node:20-slim AS runner
WORKDIR /app

# Copy only what's needed to run the production server
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Defaults for local runs; Cloud Run injects PORT at runtime (often 8080)
ENV NODE_ENV=production
ENV PORT=3100
EXPOSE 3100

# Start Next.js production server bound to $PORT
CMD ["sh", "-c", "npx next start -p ${PORT}"]