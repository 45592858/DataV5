# DataV5 - Database Version Control

Simplify database migrations and data management — no more manual database changes. Use schema files to keep everything under control.

<p align="center">
<a href="https://github.com/45592858/DataV5/blob/main/README_zh.md"><b>中文</b></a> 
</p>

---

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/45592858/DataV5.git --depth=1

# 2. Install dependencies
cd DataV5
npm install

# 3. Create the database
npm run schema-migrate:dev dev

# 4. Seed the data
npm run data-migrate:dev

# 5. (Optional) Query the data
npm run data-query:dev
```

---

## Apply Changes in Dev Environment

### Update Schema

Modify your schema (model files) under `./schema` (e.g., add a new table like `Profile`), then run:

```bash
npm run schema-migrate:dev dev
```

### Update Data

Edit SQL files under `./data`, then run:

```bash
npm run data-migrate:dev
```

---

## Promote Changes to Test/Prod

After development:

```bash
# Migrate schema to test
npm run schema-migrate:test deploy

# Migrate data to test
npm run data-migrate:test
```

---

## Use Other Databases

Update `schema/root.prisma` with a provider and configure the `DB_URL` in `.env.*`.

Examples:

### PostgreSQL
```prisma
provider = "postgresql"
DB_URL="postgresql://user:pass@localhost:5432/db?schema=public"
```

### MySQL
```prisma
provider = "mysql"
DB_URL="mysql://user:pass@localhost:3306/db"
```

### SQL Server
```prisma
provider = "sqlserver"
DB_URL="sqlserver://localhost:1433;initial catalog=db;user=sa;password=pass;"
```

### MongoDB
```prisma
provider = "mongodb"
DB_URL="mongodb://user:pass@localhost/db?authSource=admin"
```

---

## Docs & Contact

- 📘 [Read the Docs](https://github.com/45592858/DataV5/wiki)
- ⭐️ Star the repo if helpful
- 🛠 Contribute or report issues: [gmyjm@qq.com](mailto:gmyjm@qq.com?subject=[GitHub]%20DataV5%20Supports)
