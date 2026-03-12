FROM node:20-slim AS builder

WORKDIR /app

# Install openssl and libssl-dev so Prisma can detect the correct OpenSSL 3.0.x version
RUN apt-get update && apt-get install -y python3 make g++ openssl libssl-dev

COPY package.json package-lock.json tsconfig.base.json ./
COPY packages ./packages
COPY apps/api ./apps/api

RUN rm -rf node_modules && npm ci
RUN npm run build:packages
RUN npm run build:api

FROM node:20-slim AS runner

WORKDIR /app

# Install openssl and libssl-dev in the runner so `npx prisma generate` detects OpenSSL 3.0.x
RUN apt-get update && apt-get install -y openssl libssl-dev && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

WORKDIR /app/apps/api

ENV NODE_ENV=production
# Generate prisma client for production layer
RUN npx prisma generate

CMD ["node", "dist/main.js"]
