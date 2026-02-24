# ---- Single-stage (normal) Dockerfile ----
FROM node:20-slim

# Create app dir
WORKDIR /app

# Install deps exactly as locked
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# Copy source and build
COPY . .
# Helpful in CI; silences telemetry prompts
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Runtime config
ENV NODE_ENV=production
# Local default (Cloud Run will inject $PORT at runtime; we’ll bind to that)
ENV PORT=3100
EXPOSE 3100

# Start Next.js prod server bound to $PORT
CMD ["sh", "-c", "npx next start -p ${PORT}"]