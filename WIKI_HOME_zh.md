# 欢迎来到 DataV5 Wiki！

让我们为开发者简化数据库迁移、数据初始化与数据管理，实现全面可控。


## 模型迁移指南（Schema Migration）

### 概览
本项目通过自定义脚本（`schema-migrations.ts`）来处理 Prisma 在不同环境下的迁移操作。系统支持多种数据库，包括 SQLite、PostgreSQL、MySQL、SQL Server 和 MongoDB。

### 环境配置

#### 环境专属命令
项目提供了针对不同环境的命令：

```bash
# 开发环境
npm run schema-migrate:dev

# 测试环境
npm run schema-migrate:test

# 生产环境
npm run schema-migrate:prod
```

每条命令会使用对应的环境配置文件（如 `.env.development`、`.env.test`、`.env.production`）进行数据库连接。

### 迁移命令说明

#### 1. 开发环境迁移（`dev`）
```bash
npm run schema-migrate:dev dev
```
- 创建并应用开发环境的迁移文件
- 在 `prisma/migrations/` 中生成迁移文件
- 将变更应用于开发数据库
- 推荐用于本地开发和验证模型结构修改

#### 2. 生产环境部署迁移（`deploy`）
```bash
npm run schema-migrate:prod deploy
```
- 将待部署迁移应用到生产数据库
- 不会生成新迁移文件
- 适用于生产环境，安全性高
- 要求所有迁移文件需先提交版本控制

#### 3. 查看迁移状态（`status`）
```bash
npm run schema-migrate:dev status
```
- 显示迁移状态
- 列出已应用和待应用的迁移记录
- 便于追踪迁移进度

### 数据库配置

#### 支持的数据库
在 `schema/root.prisma` 中配置数据库类型：

```prisma
datasource db {
  provider = "sqlite"  // 也可使用 postgresql、mysql、sqlserver、mongodb
  url      = env("DB_URL")
}
```

#### 环境变量配置
在对应的 `.env` 文件中配置数据库连接字符串：

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

### 最佳实践

1. **版本控制**
   - 所有迁移文件需提交至版本控制系统
   - 已应用的迁移文件不可修改
   - 迁移文件应按时间顺序排列

2. **环境安全**
   - `dev` 命令仅用于开发环境
   - `deploy` 命令适用于生产环境
   - 切勿在生产环境使用 `reset`
   - 应在开发环境中充分测试迁移

3. **模型变更**
   - 模型更改应在开发环境中完成
   - 部署前需充分测试迁移效果
   - 保持迁移变更小而集中
   - 记录破坏性变更
   - 切勿手动修改数据库，应通过 schema 文件控制

4. **数据安全**
   - 在迁移前务必备份数据库
   - 使用接近生产的数据进行测试
   - 对复杂的数据修改使用独立的数据迁移脚本

5. **团队协作**
   - 与团队成员协调模型结构变更
   - 应在应用迁移前审查迁移文件
   - 保持迁移历史整洁、有序

## 数据迁移指南

### 1. SQL 文件命名规范
- 命名格式：`YYYYMMDD-XXX_ENV_描述.sql`
  - `YYYYMMDD`: 8 位日期，表示创建时间
  - `XXX`: 3 位序号，用于排序
  - `ENV`: 环境标识，可为：
    - `all`: 所有环境通用
    - `dev`: 仅限开发环境
    - `test`: 仅限测试环境
    - `prod`: 仅限生产环境
  - `描述`: 文件内容简要说明

示例：
- `20240315-001_all_initial_data.sql`
- `20240315-002_dev_test_data.sql`
- `20240315-003_prod_production_data.sql`

### 2. 文件存放位置
- 所有 SQL 脚本文件应存放在项目根目录的 `data` 文件夹内

### 3. 执行顺序
- 系统按文件名升序执行
- 相同日期下，序号（XXX）决定执行先后
- 建议使用连续编号（如 001, 002, 003）

### 4. 环境区分
- 执行迁移时必须指定环境参数：`dev`、`test` 或 `prod`
- 系统将自动执行：
  - 匹配当前环境的 SQL 文件
  - 标记为 `all` 的通用文件
- 其他环境的文件将自动跳过

### 5. SQL 文件内容规范
- 支持的 SQL 语句类型：
  - INSERT
  - UPDATE
  - DELETE
  - SELECT
  - MERGE
  - REPLACE
  - CALL
  - EXECUTE / EXEC
  - SET
  - ...（你可以通过修改脚本轻松扩展支持更多命令）

- 格式要求：
  - 每条 SQL 语句需以分号结尾（;）
  - 支持多行 SQL
  - 空行将自动忽略

### 6. 错误处理机制
- 系统将自动忽略以下错误：
  - 唯一性约束冲突（如重复主键）
  - 重复记录
  - UNIQUE KEY 冲突

- 其他错误将导致迁移中断并失败

### 7. 执行方法
```bash
# 开发环境
npm run data-migration dev

# 测试环境
npm run data-migration test

# 生产环境
npm run data-migration prod
```


## 关于本项目

- 本项目依赖于 Node.js 和 [Prisma](https://github.com/prisma/prisma)（下一代 Node.js ORM 工具）
- 若您希望了解本项目背后的技术，请参考 [Prisma 官方文档](https://www.prisma.io/docs/orm)
