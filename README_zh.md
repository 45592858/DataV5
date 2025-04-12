# DataV5 - 数据库版本控制工具

为开发者简化数据库迁移、数据初始化与数据管理，实现全面可控。
切勿手动修改数据库，应通过 schema 文件控制。



## 快速开始

### 1. 克隆整个项目仓库

```
git clone https://github.com/45592858/DataV5.git --depth=1
```

### 2. 安装 npm 依赖项

```
cd DataV5
npm install
```

### 3. 创建数据库

运行以下命令来创建 SQLite 数据库文件。此命令同时创建 `User` 和 `Post` 表，这些表定义在 [`schema files`](./schema) 中：

```
npm run schema-migrate:dev dev
```

### 4. 初始化数据

执行以下命令来运行数据迁移脚本：

```
npm run data-migrate:dev
```

### 5. 查看数据（可选）

执行以下命令来查询数据库数据：

```
npm run data-query:dev
```



## 迁移结构或数据变更（开发阶段）

### 1. 更新数据模型

第一步是向数据库添加一个新表，例如 `Profile` 表。你可以通过向 [`schema files`](./schema/module-01.prisma) 添加 model，并执行一次迁移操作：

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

更新 model 后，运行以下命令将变更应用到数据库：

```
npm run schema-migrate:dev dev
```

### 2. 更新数据（用于初始化配置、测试数据等）

首先添加新的 SQL 语句（例如 `INSERT`、`UPDATE` 等）。你可以通过更新 [`data files`](./data/20250202-001_dev_init.sql)，然后执行一次迁移操作：

```diff
// 20250202-001_dev_init.sql

INSERT INTO Post (id,title,content,authorId) VALUES (4, 'Post 4', 'Content 4', 4);
INSERT INTO Post (id,title,content,authorId) VALUES (5, 'Post 5', 'Content 5', 5);
INSERT INTO Post (id,title,content,authorId) VALUES (6, 'Post 6', 'Content 6', 6);
+INSERT INTO Post (id,title,content,authorId) VALUES (7, 'Post 7', 'Content 7', 6);
```

更新数据文件后，运行以下命令将变更写入数据库：

```
npm run data-migrate:dev
```



## 从开发环境迁移到测试/生产环境

完成开发工作后，可以将 [`schema files`](./schema) 和 [`data files`](./data) 随你的应用源代码一同提交到你的代码仓库，然后执行迁移命令。

检出刚才提交的代码，运行以下命令将结构变更迁移至测试数据库：

```
npm run schema-migrate:test deploy
```

同样，运行以下命令将数据变更迁移至测试数据库：

```
npm run data-migrate:test
```



## 切换使用其他数据库（如 PostgreSQL、MySQL、SQL Server、MongoDB）

若你希望使用除 SQLite 以外的数据库，只需在 [`root.prisma`](./schema/root.prisma) 中修改 `datasource` 配置。

### PostgreSQL

连接字符串格式如下：

```
datasource db {
  provider = "postgresql"
  url      = env("DB_URL")
}
```

并在 [`DB_URL`](./env.development) 中配置如下：

```
DB_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA" 
```

本地 PostgreSQL 示例：

```
DB_URL="postgresql://janedoe:mypassword@localhost:5432/notesapi?schema=public"
```

### MySQL

连接字符串格式如下：

```
datasource db {
  provider = "mysql"
  url      = env("DB_URL")
}
```

并在 [`DB_URL`](./env.development) 中配置如下：

```
DB_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE" 
```

本地 MySQL 示例：

```
DB_URL="mysql://janedoe:mypassword@localhost:3306/notesapi"
```

### Microsoft SQL Server

本地 SQL Server 示例：

```prisma
datasource db {
  provider = "sqlserver"
  url      = env("DB_URL")
}
```

配置方式如下：

```
DB_URL="sqlserver://localhost:1433;initial catalog=sample;user=sa;password=mypassword;"
```

### MongoDB

本地 MongoDB 示例：

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DB_URL")
}
```

配置方式如下：

```
DB_URL="mongodb://USERNAME:PASSWORD@HOST/DATABASE?authSource=admin&retryWrites=true&w=majority"
```



## 文档资源

- 查看 [DataV5 官方文档](https://github.com/45592858/DataV5/wiki)



## 后续操作建议

- 如果你觉得这个项目有帮助，请为它点个 ⭐️ Star
- 欢迎将上述结构迁移与数据迁移集成到你的 DevOps 或 CI/CD 流程中
- 如果你有问题反馈或希望贡献代码，请通过邮件联系我们：[gmyjm@qq.com](mailto:gmyjm@qq.com?subject=[GitHub]%20DataV5%20Supports)，一起让这个工具更加强大！
