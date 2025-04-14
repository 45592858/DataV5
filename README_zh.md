# DataV5 - 数据库版本控制工具

简化数据库迁移与数据管理 —— 拒绝手动改库，统一用 schema 文件掌控全局。

---

## 快速开始

```bash
# 1. 克隆项目
git clone https://github.com/45592858/DataV5.git --depth=1

# 2. 安装依赖
cd DataV5
npm install

# 3. 创建数据库
npm run schema-migrate:dev dev

# 4. 初始化数据
npm run data-migrate:dev

# 5. （可选）查询数据
npm run data-query:dev
```

---

## 在开发环境中应用变更

### 更新数据库结构

修改 `./schema`目录下的 model（例如新增表 `Profile`），然后执行：

```bash
npm run schema-migrate:dev dev
```

### 更新初始化数据

编辑 `./data` 目录下的 SQL 文件，然后执行：

```bash
npm run data-migrate:dev
```

---

## 推送变更到测试/生产环境

开发完成后：

```bash
# 推送结构变更到测试环境
npm run schema-migrate:test deploy

# 推送数据变更到测试环境
npm run data-migrate:test
```

---

## 切换其他数据库

修改 `schema/root.prisma` 中的 provider，配置 `.env.*` 中的 `DB_URL`。

示例：

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

## 文档与联系

- 📘 [查看使用文档](https://github.com/45592858/DataV5/wiki)
- ⭐️ 如果觉得有帮助，欢迎点 Star
- 🛠 问题反馈与贡献：[gmyjm@qq.com](mailto:gmyjm@qq.com?subject=[GitHub]%20DataV5%20Supports)
