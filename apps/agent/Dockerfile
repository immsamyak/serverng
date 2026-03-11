FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy root configurations and workspaces
COPY package.json package-lock.json tsconfig.base.json ./
COPY packages ./packages
COPY apps/agent ./apps/agent

# Install dependencies and build shared packages + agent
RUN npm ci
RUN npm run build:packages
RUN npm run build:agent

FROM node:20-alpine AS runner

WORKDIR /app

# The agent needs access to the host docker socket, so docker-cli is useful
RUN apk add --no-cache docker-cli

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/agent/package.json ./apps/agent/
COPY --from=builder /app/apps/agent/dist ./apps/agent/dist

WORKDIR /app/apps/agent

ENV NODE_ENV=production

CMD ["npm", "start"]
