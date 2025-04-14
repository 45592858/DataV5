# DataV5 - Complete Usage Guide

A comprehensive tool for managing database schema and data migrations with full control, supporting SQLite, PostgreSQL, MySQL, SQL Server, and MongoDB.

<p align="center">
<a href="https://github.com/45592858/DataV5/wiki/Home_zh"><b>中文</b></a> 
</p>

---

## 🔧 Setup

### 1. Clone and Install

```bash
git clone https://github.com/45592858/DataV5.git --depth=1
cd DataV5
npm install
```

---

## 🧱 Schema Migrations

Schema changes are handled via a custom script that wraps Prisma CLI functionality.

### Environment-Specific Commands

```bash
npm run schema-migrate:dev     # Development
npm run schema-migrate:test    # Test
npm run schema-migrate:prod    # Production
```

Each command uses its corresponding `.env` file (e.g., `.env.development`).

### Apply a Migration

#### 1. Edit Schema

Update your Prisma model (e.g., add `Profile`) in `/schema/*.prisma`.

```diff
// module-01.prisma

model Post {
  id        Int     @default(autoincrement()) @id
  title     String
  content   String?
  published Boolean @default(false)
  author    User?   @relation(fields: [authorId], references: [id])
  authorId  Int
}

model User {
  id      Int      @default(autoincrement()) @id
  name    String?
  email   String   @unique
  posts   Post[]
+ profile Profile?
}

+model Profile {
+  id     Int     @default(autoincrement()) @id
+  bio    String?
+  userId Int     @unique
+  user   User    @relation(fields: [userId], references: [id])
+}
```

#### 2. Run Migration

```bash
npm run schema-migrate:dev dev
```

This will:
- Generate a migration in `prisma/migrations`
- Apply it to the development DB

### Production Deploy

After committing changes:

```bash
npm run schema-migrate:prod deploy
```

### Migration Status

```bash
npm run schema-migrate:dev status
```

---

## 🧪 Data Migrations

### SQL File Naming

Pattern: `YYYYMMDD-XXX_ENV_description.sql`

Example:
```
20240401-001_dev_seed_users.sql
```

- `ENV` can be `dev`, `test`, `prod`, or `all`

### Place Files

Store SQL files in the `/data` directory.

### Execute Data Scripts

```bash
npm run data-migration dev
npm run data-migration test
npm run data-migration prod
```

Files are:
- Executed in filename order
- Filtered by `ENV` or `all`

### Supported SQL Types

- INSERT, UPDATE, DELETE, SELECT
- MERGE, REPLACE, CALL, EXECUTE
- All statements must end with `;`

### Error Handling

Auto-ignores:
- Duplicate keys
- Unique constraint violations

---

## 🔁 Move to Test/Prod

```bash
npm run schema-migrate:test deploy
npm run data-migrate:test
```

Repeat with `prod` for production.

---

## 🔄 Multi-DB Support

Update `schema/root.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // or mysql, sqlserver, mongodb, sqlite
  url      = env("DB_URL")
}
```

Set `DB_URL` in `.env.*`:

```env
# PostgreSQL
DB_URL="postgresql://user:pass@localhost:5432/db?schema=public"

# MySQL
DB_URL="mysql://user:pass@localhost:3306/db"

# SQL Server
DB_URL="sqlserver://localhost:1433;initial catalog=db;user=sa;password=pass;"

# MongoDB
DB_URL="mongodb://user:pass@localhost/db?authSource=admin"
```

---

## ✅ Best Practices

- Always commit migrations
- Never manually alter the DB
- Test everything in `dev` first
- Backup data before running large migrations
- Use meaningful and timestamped SQL filenames
- Coordinate schema changes within your team

---

## 📘 More Documentation & Help

- It depends on Node.js and [Prisma](https://github.com/prisma/prisma), the next-generation ORM for Node.js.
- If you want to understand the technology behind the project, please refer to the [Prisma Docs](https://www.prisma.io/docs/orm).
