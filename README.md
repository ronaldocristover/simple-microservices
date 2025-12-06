# Simple Microservices - Express.js Service

A basic Express.js service with a modular, scalable architecture built with TypeScript and powered by Bun.

## Project Structure

```
simple-microservices/
├── src/             # Source code directory
│   ├── config/      # Configuration files
│   │   └── index.ts
│   ├── controllers/ # Request handlers (business logic)
│   │   ├── example.controller.ts
│   │   └── health.controller.ts
│   ├── db/          # Database configuration
│   │   └── index.ts # Prisma Client instance
│   ├── middlewares/ # Custom middleware functions
│   │   ├── errorHandler.middleware.ts
│   │   └── notFound.middleware.ts
│   ├── repositories/ # Data access layer
│   │   └── example.repository.ts
│   ├── routes/      # Route definitions
│   │   ├── index.ts
│   │   ├── exampleRoutes.ts
│   │   └── healthRoutes.ts
│   ├── services/    # Business logic layer
│   │   └── example.service.ts
│   ├── types/       # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/       # Utility functions
│   │   └── logger.ts
│   ├── app.ts       # Express app configuration
│   └── server.ts    # Server entry point
├── prisma/          # Prisma schema and migrations
│   └── schema.prisma # Database schema definition
├── dist/            # Compiled JavaScript (generated)
├── tsconfig.json    # TypeScript configuration
├── package.json     # Dependencies
└── README.md        # This file
```

## Features

- ✅ Bun runtime - Fast JavaScript/TypeScript runtime
- ✅ TypeScript for type safety (native support in Bun)
- ✅ Prisma ORM for type-safe database queries
- ✅ MySQL database support
- ✅ Modular architecture (routes, controllers, services, middlewares)
- ✅ Error handling middleware
- ✅ Request logging with Morgan
- ✅ Security headers with Helmet
- ✅ CORS support
- ✅ Environment configuration
- ✅ Health check endpoint
- ✅ Graceful shutdown with database connection cleanup

## Prerequisites

- [Bun](https://bun.sh) installed on your system
  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```

## Setup

1. Install dependencies:
```bash
bun install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```
PORT=3000
NODE_ENV=development
API_PREFIX=/api/v1
DATABASE_URL=mysql://user:password@localhost:3306/mydb
```

4. Set up the database:
   - Make sure MySQL is running
   - Create a database (or use an existing one)
   - Update the `DATABASE_URL` in your `.env` file

5. Set up the database schema:
```bash
bun run db:generate  # Generate Prisma Client
bun run db:push      # Push schema to database (development)
# OR
bun run db:migrate   # Create and apply migrations (production)
```

## Running the Service

### Development mode (with auto-reload - Bun runs TypeScript natively):
```bash
bun run dev
```

### Production mode (runs TypeScript directly with Bun):
```bash
bun run start
```

### Build for production (optional - Bun can run TypeScript directly):
```bash
bun run build
```

## API Endpoints

### Health Check
- `GET /health` - Basic health check
- `GET /api/v1/health` - Health check with detailed info

### Example Routes (CRUD operations)
- `GET /api/v1/example` - Get all examples
- `GET /api/v1/example/:id` - Get example by ID
- `POST /api/v1/example` - Create a new example
- `PUT /api/v1/example/:id` - Update an example
- `DELETE /api/v1/example/:id` - Delete an example

## Example API Calls

### Get all examples:
```bash
curl http://localhost:3000/api/v1/example
```

### Get example by ID:
```bash
curl http://localhost:3000/api/v1/example/1
```

### Create example:
```bash
curl -X POST http://localhost:3000/api/v1/example \
  -H "Content-Type: application/json" \
  -d '{"title": "Example Title", "description": "Example description"}'
```

### Update example:
```bash
curl -X PUT http://localhost:3000/api/v1/example/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title", "description": "Updated description"}'
```

### Delete example:
```bash
curl -X DELETE http://localhost:3000/api/v1/example/1
```

### Health check:
```bash
curl http://localhost:3000/api/v1/health
```

## Database Management

### Prisma ORM Commands

- **Generate Prisma Client**: `bun run db:generate` - Generate Prisma Client from schema
- **Push schema**: `bun run db:push` - Push schema changes directly to database (recommended for development)
- **Create and apply migrations**: `bun run db:migrate` - Create migration files and apply them to database
- **Open Prisma Studio**: `bun run db:studio` - Open Prisma Studio for database management

### Schema Management

Database schemas are defined in `prisma/schema.prisma` using Prisma. Example models:
- `User` - User management
- `Example` - Example data for CRUD operations

To add a new model:
1. Define the model in `prisma/schema.prisma`
2. Run `bun run db:generate` to regenerate Prisma Client
3. Run `bun run db:push` (development) or `bun run db:migrate` (production) to apply changes

## Adding New Features

1. Define database schema in `prisma/schema.prisma` if needed
2. Run `bun run db:generate` and `bun run db:push` to update database
3. Create a service in `src/services/` for business logic (use Prisma Client)
4. Create a controller in `src/controllers/` to handle requests
5. Create routes in `src/routes/` to define endpoints
6. Register routes in `src/routes/index.ts`
7. Add type definitions in `src/types/` if needed

## Dependencies

- **express**: Web framework
- **dotenv**: Environment variable management
- **cors**: Cross-Origin Resource Sharing
- **helmet**: Security headers
- **morgan**: HTTP request logger
- **@prisma/client**: Prisma Client for type-safe database access

## Development Dependencies

- **typescript**: TypeScript compiler
- **prisma**: Prisma CLI tool for migrations and schema management
- **@types/express**: TypeScript definitions for Express
- **@types/node**: TypeScript definitions for Node.js (for compatibility)
- **@types/cors**: TypeScript definitions for CORS
- **@types/morgan**: TypeScript definitions for Morgan

## Runtime

- **Bun**: Fast JavaScript/TypeScript runtime that runs TypeScript natively without compilation step

