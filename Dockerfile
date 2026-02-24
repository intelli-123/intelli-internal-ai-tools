# ---- Next.js production image for Cloud Run ----
FROM node:20-slim

# 1) App dir
WORKDIR /app

# 2) Install deps exactly as locked
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# 3) Copy source and build
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 4) Runtime config: Cloud Run injects PORT at runtime (often 8080)
#    We'll default to 3100 for local runs; Cloud Run overrides it.
ENV NODE_ENV=production
ENV PORT=3100
EXPOSE 3100

# 5) Start the Next.js production server bound to $PORT
#    (equivalent to `next start -p $PORT`)
CMD ["npm", "run", "start", "--", "-p", "${PORT}"]