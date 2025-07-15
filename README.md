# nodejs-auth-app

This project uses [Prisma](https://www.prisma.io/) for database schema management and [pnpm](https://pnpm.io/) as the package manager.

## Prerequisites

- NestJS (Typescript + Node.js)
- [PNPM](https://pnpm.io/installation)
- [Prisma CLI](https://www.prisma.io/docs/reference/api-reference/command-reference) (used via `npx`)
- GNU Make (or compatible)

## Documentation
### 📃 Swagger
```
http://localhost:3000/api-docs
```

## Makefile Commands

### ⚓ Docker Deployment 
```
make deploy-docker
```

### 🔧 Generate Prisma Client
Generate or update the Prisma client:
```bash
make generate-model
```

### 🧱 Create New Migration

```
make generate-migration name=your_migration_name
```
Generates a new migration file. Replace your_migration_name with a descriptive name.


### 📦 Apply Migrations
```
make migrate
```
Applies all pending migrations to the database (production-safe).

### 🚀 Run Server
```
make run
```
Starts the development server using <i>pnpm start:dev</i>

