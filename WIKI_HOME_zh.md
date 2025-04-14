# DataV5 - 完整使用指南

一个用于数据库结构与数据迁移的全面管理工具，支持 SQLite、PostgreSQL、MySQL、SQL Server 与 MongoDB，实现全流程控制。

---

## 🔧 环境准备

### 1. 克隆并安装依赖

```bash
git clone https://github.com/45592858/DataV5.git --depth=1
cd DataV5
npm install
```

---

## 🧱 数据库结构迁移（Schema Migration）

结构变更通过自定义脚本进行封装，基于 Prisma 实现。

### 环境命令示例

```bash
npm run schema-migrate:dev     # 开发环境
npm run schema-migrate:test    # 测试环境
npm run schema-migrate:prod    # 生产环境
```

每个命令使用各自的 `.env` 文件，如 `.env.development`。

### 应用结构迁移

#### 1. 编辑 Schema 文件

修改 `/schema/*.prisma` 中的数据模型（如新增 `Profile` 表）。

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

#### 2. 执行迁移

```bash
npm run schema-migrate:dev dev
```

该命令将：
- 在 `prisma/migrations` 生成迁移文件
- 应用到开发数据库

### 生产环境部署

提交后执行：

```bash
npm run schema-migrate:prod deploy
```

### 查看迁移状态

```bash
npm run schema-migrate:dev status
```

---

## 🧪 数据迁移（Data Migration）

### SQL 文件命名规范

格式：`YYYYMMDD-XXX_ENV_描述.sql`

示例：
```
20240401-001_dev_seed_users.sql
```

- `ENV` 可为：`dev`、`test`、`prod` 或 `all`

### 文件存放路径

SQL 文件放置于项目根目录的 `/data` 文件夹中。

### 执行迁移命令

```bash
npm run data-migration dev
npm run data-migration test
npm run data-migration prod
```

执行方式：
- 按文件名顺序执行
- 仅执行匹配当前环境或 `all` 的文件

### 支持的 SQL 类型

- INSERT、UPDATE、DELETE、SELECT
- MERGE、REPLACE、CALL、EXECUTE 等
- 每条语句必须以分号 `;` 结尾

### 错误处理机制

自动忽略：
- 唯一性约束冲突
- 主键重复等异常

---

## 🔁 推送至测试 / 生产环境

```bash
npm run schema-migrate:test deploy
npm run data-migrate:test
```

生产环境替换 `test` 为 `prod` 即可。

---

## 🔄 多数据库支持

修改 `schema/root.prisma`：

```prisma
datasource db {
  provider = "postgresql"  // 或 mysql, sqlserver, mongodb, sqlite
  url      = env("DB_URL")
}
```

配置 `.env.*` 文件中的 `DB_URL`：

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

## ✅ 最佳实践

- 所有迁移务必提交版本控制
- 禁止直接操作数据库
- 所有变更应在开发环境验证
- 数据迁移前请先备份
- 命名清晰、包含时间戳的 SQL 文件更易维护
- 团队内协调结构变更，统一部署节奏

---

## 📘 更多文档与支持

- 本项目依赖于 Node.js 和 [Prisma](https://github.com/prisma/prisma)（下一代 Node.js ORM 工具）
- 若您希望了解本项目背后的技术，请参考 [Prisma 官方文档](https://www.prisma.io/docs/orm)

