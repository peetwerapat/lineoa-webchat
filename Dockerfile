# Stage 1: Base image with shared global dependencies
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat \
    && npm install -g pnpm env-cmd

# Stage 2: Install dependencies using the appropriate package manager
FROM base AS deps
WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile --ignore-scripts

# Stage 3: Build the application
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm prisma generate
RUN pnpm run build

# Stage 4: Final runtime image
FROM node:22-alpine AS runner
WORKDIR /app

# Create secure non-root user
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone/ /app/
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000

# Run the Next.js standalone server
CMD ["node", "server.js"]
