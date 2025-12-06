# Use Bun official image
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS install
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Copy source code and prisma files
FROM base AS prerelease
COPY --from=install /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN bunx prisma generate

# Production stage
FROM base AS release
WORKDIR /app

# Copy dependencies and generated Prisma Client
COPY --from=install /app/node_modules ./node_modules
COPY --from=prerelease /app/node_modules/.prisma ./node_modules/.prisma

# Copy application files
COPY package.json ./
COPY prisma ./prisma
COPY src ./src
COPY tsconfig.json ./

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Run database migrations and start server
CMD ["sh", "-c", "bunx prisma migrate deploy && bun run src/server.ts"]

