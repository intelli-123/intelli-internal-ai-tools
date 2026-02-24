# --- Build Stage ---
FROM node:20-slim as builder

# Install system dependencies required for native Node.js modules during build
# and essential runtime libraries like libstdc++6 and libssl-dev.
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    pkg-config \
    python3 \
    libstdc++6 \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and install dependencies
# 'npm install' is used to better handle platform-specific native modules.
COPY package*.json ./
RUN npm install --no-audit --no-fund

# Copy the rest of the application code
COPY . .

# Disable Next.js telemetry prompts during build
ENV NEXT_TELEMETRY_DISABLED=1
# Build the Next.js application for production
RUN npm run build

# --- Production Stage ---
FROM node:20-slim

WORKDIR /app

# Set runtime environment variables for production
ENV NODE_ENV=production
ENV PORT=3100

# Copy only the necessary files from the build stage to keep the final image small
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3100

# Start the Next.js production server
CMD ["npm", "run", "start"]