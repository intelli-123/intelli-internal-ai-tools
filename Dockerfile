FROM node:20-slim
WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

ENV NODE_ENV=production
ENV PORT=3100
EXPOSE 3100

CMD ["npm", "run", "start", "--", "-p", "${PORT}"]