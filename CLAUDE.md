# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `bun run dev` - Start development server with hot reload (Bun runs TypeScript natively)
- `bun run start` - Start production server (Bun runs TypeScript directly)
- `bun run build` - Build for production to `./dist` directory

### Testing
- No testing framework currently configured (package.json test script returns error)
- Consider adding Jest/Bun test for unit and integration tests

### Database Management
- `bun run db:generate` - Generate Prisma Client from schema
- `bun run db:push` - Push schema changes directly to database (development)
- `bun run db:migrate` - Create and apply migrations (production)
- `bun run db:studio` - Open Prisma Studio for database management
- `bun run db:seed` - Populate database with initial data

### Docker Commands
- `bun run docker:dev` - Start with Docker Compose in development mode
- `bun run docker:prod` - Start with Docker Compose in production mode
- `bun run docker:down` - Stop Docker Compose services

## Architecture Overview

This is an Express.js microservice built with TypeScript and Bun runtime, following a layered architecture pattern:

### Application Structure
- **`src/app.ts`** - Express app configuration with middleware setup
- **`src/server.ts`** - Server entry point with graceful shutdown handling
- **`src/config/`** - Environment and application configuration
- **`src/db/prisma.ts`** - Prisma client with custom error handling and logging

### Layered Architecture
1. **Routes Layer** (`src/routes/`) - API endpoint definitions with versioned prefix (`/api/v1`)
2. **Controllers Layer** (`src/controllers/`) - Request/response handling
3. **Services Layer** (`src/services/`) - Business logic implementation
4. **Repositories Layer** (`src/repositories/`) - Data access using Prisma Client

### Database
- **Provider:** MySQL with Prisma ORM
- **Schema:** Defined in `prisma/schema.prisma`
- **Models:** `User` and `Example` with standard CRUD operations
- **Error Handling:** Custom `PrismaExceptionHandler` class for common database errors

### Key Features
- **Graceful Shutdown:** Proper database connection cleanup on SIGTERM/SIGINT
- **Structured Logging:** Winston logger with development/production modes
- **Error Handling:** Centralized error middleware with Prisma error translation
- **Security:** Helmet, CORS, and request logging with Morgan
- **API Versioning:** All routes prefixed with configurable `/api/v1`

### Adding New Features
1. Define model in `prisma/schema.prisma`
2. Run `bun run db:generate && bun run db:push`
3. Create repository in `src/repositories/` for data access
4. Create service in `src/services/` for business logic
5. Create controller in `src/controllers/` for request handling
6. Add routes in `src/routes/` and register in `src/routes/index.ts`

### Environment Variables
Key variables for configuration:
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `API_PREFIX` - API route prefix (default: /api/v1)
- `DATABASE_URL` - MySQL connection string
- `LOG_LEVEL` - Winston log level
- `DATABASE_CONNECTION_LIMIT` - Prisma connection pool limit (default: 10)
- `DATABASE_POOL_TIMEOUT` - Prisma pool timeout in seconds (default: 10)

### TypeScript Configuration
- Strict mode enabled with comprehensive type checking
- Target: ES2020, Module: CommonJS
- Output directory: `./dist`
- Includes unused variable/parameter checks and implicit return detection