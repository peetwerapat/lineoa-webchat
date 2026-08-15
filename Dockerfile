# Stage 1: Base image with shared global dependencies
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat \
    && npm install -g pnpm env-cmd

# Stage 2: Install dependencies using the appropriate package manager
FROM base AS deps
WORKDIR /app

COPY package.json ./
COPY yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; \
  else echo "No lockfile found." && exit 1; \
  fi

# Stage 3: Build the application
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

COPY .env .env

RUN pnpm run build

# Stage 4: Final runtime image
FROM node:20-alpine AS runner
WORKDIR /app

# Create secure non-root user
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone/ /app/
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Run the Next.js standalone server
CMD ["node", "server.js"]
