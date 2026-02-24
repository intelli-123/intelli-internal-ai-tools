# ---------- 1) Dependencies layer ----------
FROM node:20-slim AS deps
WORKDIR /app

# Install deps exactly as locked
COPY package*.json ./
RUN npm ci

# ---------- 2) Build layer ----------
FROM node:20-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------- 3) Runtime layer (Cloud Run) ----------
FROM node:20-slim AS runner
WORKDIR /app

# Copy only what's needed to run the production server
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Cloud Run injects PORT at runtime (default 8080). We'll default to 3100 for local runs.
ENV NODE_ENV=production
ENV PORT=3100

# Expose is just metadata; Cloud Run still routes to $PORT.
EXPOSE 3100

# Start Next.js production server bound to $PORT
CMD ["sh", "-c", "npx next start -p ${PORT}"]