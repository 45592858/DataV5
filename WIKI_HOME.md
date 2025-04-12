# Welcome to the DataV5 Wiki!

Let's **simplify** database migrations, data initialization, and data management with full control for developers.

<p align="center">
<a href="https://github.com/45592858/DataV5/wiki/home_zh"><b>中文</b></a> 
</p>


## Schema Migration Guide

### Overview
Schema migrations in this project are handled through a custom script (`schema-migrations.ts`) that manages Prisma migrations across different environments. This system supports various database providers including SQLite, PostgreSQL, MySQL, MS SQL Server, and MongoDB.

### Environment Setup

#### Environment-Specific Commands
The project provides different commands for different environments:

```bash
# Development environment
npm run schema-migrate:dev

# Test environment
npm run schema-migrate:test

# Production environment
npm run schema-migrate:prod
```

Each command uses its corresponding environment file (`.env.development`, `.env.test`, `.env.production`) for database configuration.

### Migration Commands

#### 1. Development Migrations (`dev`)
```bash
npm run schema-migrate:dev dev
```
- Creates and applies migrations in development mode.
- Generates migration files in `prisma/migrations/`.
- Applies changes to the development database.
- This command is best suited for local development and testing schema changes.

#### 2. Production Migrations (`deploy`)
```bash
npm run schema-migrate:prod deploy
```
- Applies pending migrations to the production database.
- Does not create new migration files.
- Safe for production environments.
- Requires that all migrations be committed to version control.

#### 3. Check Migration Status (`status`)
```bash
npm run schema-migrate:dev status
```
- Shows the status of migrations.
- Lists applied and pending migrations.
- Useful for checking the migration state.

### Database Configuration

#### Supported Databases
The project supports multiple database providers. Configure in `schema/root.prisma`:

```prisma
datasource db {
  provider = "sqlite"  // or postgresql, mysql, sqlserver, mongodb
  url      = env("DB_URL")
}
```

#### Environment Variables
Configure database connection strings in respective `.env` files:

1. **SQLite**:
```
DB_URL="file:./dev.db"
```

2. **PostgreSQL**:
```
DB_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA"
```

3. **MySQL**:
```
DB_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
```

4. **SQL Server**:
```
DB_URL="sqlserver://localhost:1433;Initial Catalog=sample;user=sa;password=mypassword;"
```

5. **MongoDB**:
```
DB_URL="mongodb://USERNAME:PASSWORD@HOST/DATABASE?authSource=admin&retryWrites=true&w=majority"
```

### Best Practices

1. **Version Control**
   - Always commit migration files to version control.
   - Never modify migration files after they've been applied.
   - Keep migration files in chronological order.

2. **Environment Safety**
   - Use the `dev` command only in development.
   - Use the `deploy` command in production.
   - Never use `reset` in production.
   - Test migrations in development before applying to production.

3. **Schema Changes**
   - Make schema changes in development first.
   - Test migrations thoroughly before deploying.
   - Keep each migration small and focused.
   - Document breaking changes.
   - Never modify the database manually; always use schema files to control changes.

4. **Data Safety**
   - Back up data before running migrations.
   - Test migrations with production-like data.
   - Consider data migration scripts for complex changes.

5. **Team Collaboration**
   - Coordinate schema changes with team members.
   - Review migration files before applying.
   - Maintain a clean and well-organized migration history.

## Data Migration Guide

### 1. Data File Naming Convention
- File name format: `YYYYMMDD-XXX_ENV_description.sql`
  - `YYYYMMDD`: 8-digit date, indicating the creation date.
  - `XXX`: 3-digit sequence number for ordering.
  - `ENV`: Environment identifier, possible values:
    - `all`: Applies to all environments.
    - `dev`: Development environment only.
    - `test`: Testing environment only.
    - `prod`: Production environment only.
  - `description`: Brief description of the file content.

Examples:
- `20240315-001_all_initial_data.sql`
- `20240315-002_dev_test_data.sql`
- `20240315-003_prod_production_data.sql`

### 2. Data File Location
- All data files (i.e., SQL script files) should be placed in the `data` folder at the project root.

### 3. Execution Order
- Files are executed in ascending order based on filename.
- Sequence number (XXX) controls the execution order for files with the same date.
- Use consecutive numbers (e.g., 001, 002, 003) for better organization.

### 4. Environment Differentiation
- The environment parameter must be specified when executing: `dev`, `test`, or `prod`.
- The system automatically executes:
  - SQL files matching the specified environment.
  - Files marked as `all`.
- Files for other environments are automatically skipped.

### 5. SQL File Content Requirements
- Supported SQL statement types:
  - INSERT
  - UPDATE
  - DELETE
  - SELECT
  - MERGE
  - REPLACE
  - CALL
  - EXECUTE / EXEC
  - SET
  - ... (You can easily extend to support additional SQL commands by modifying the data migration script.)

- Statement format requirements:
  - Each SQL statement must end with a semicolon (;).
  - Multi-line SQL statements are also supported.
  - Empty lines are automatically ignored.

### 6. Error Handling
- The system automatically ignores the following errors:
  - Unique constraint violations (duplicate key errors).
  - Duplicate entries.
  - UNIQUE KEY constraint violations.

- Other errors will cause the migration to fail and stop execution.

### 7. How to Execute Migrations
```bash
# Development environment
npm run data-migration dev

# Testing environment
npm run data-migration test

# Production environment
npm run data-migration prod
```


## About this project

- It depends on Node.js and [Prisma](https://github.com/prisma/prisma), the next-generation ORM for Node.js.
- If you want to understand the technology behind the project, please refer to the [Prisma Docs](https://www.prisma.io/docs/orm).