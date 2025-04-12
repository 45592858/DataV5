# DataV5 - Database Version Control

Simplifying Database Migrations, Data Initialization, and Data Management with Full Control for Developers.
Never modify the database manually; always use schema files to control changes.

<p align="center">
<a href="https://github.com/45592858/DataV5/blob/main/README_zh.md"><b>中文</b></a> 
</p>



## Getting started

### 1. Clone the entire repo

```
git clone https://github.com/45592858/DataV5.git --depth=1
```

### 2. Install npm dependencies

```
cd DataV5
npm install
```

### 3. Create the database

Run the following command to create your SQLite database file. This also creates the `User` and `Post` tables that are defined in [`schema files`](./schema):

```
npm run schema-migrate:dev dev
```

### 4. Seed the data

Execute the script with this command:

```
npm run data-migrate:dev
```

### 5. Check the data (optional)

Execute the script with this command:

```
npm run data-query:dev
```



## Migrate schema changes or data changes (dev phase)

### 1. Update your model

The first step is to add a new table, e.g. called `Profile`, to the database, by adding a new model to your [`schema files`](./schema/module-01.prisma) and then running a migration afterwards:

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

Once you've updated your data model, you can execute the changes against your database with the following command:

```
npm run schema-migrate:dev dev
```

### 2. Update your data (for any purpose e.g. Initialization config / Testing data etc ...)

Start by adding a new SQL statement (e.g. `INSERT`, `UPDATE`, etc...). You can do this by updating [`data files`](./data/20250202-001_dev_init.sql) and then running a migration afterwards:

```diff
// 20250202-001_dev_init.sql

INSERT INTO Post (id,title,content,authorId) VALUES (4, 'Post 4', 'Content 4', 4);
INSERT INTO Post (id,title,content,authorId) VALUES (5, 'Post 5', 'Content 5', 5);
INSERT INTO Post (id,title,content,authorId) VALUES (6, 'Post 6', 'Content 6', 6);
+INSERT INTO Post (id,title,content,authorId) VALUES (7, 'Post 7', 'Content 7', 6);
```

Once you've updated your data file, you can execute the changes to your database with the following command:

```
npm run data-migrate:dev
```



## Migrate schema changes or data changes (from dev to test/prod)

Once you've completed your development work, you can `commit`  your  [`schema files`](./schema) and [`data files`](./data) with your source code to your source code repository, and then running a migration afterwards.

Check out your source code with just commit, then you can migrate the schema changes against your testing environment database with the following command:

```
npm run schema-migrate:test deploy
```

Check out your `commit` just now, then you can migrate the data changes against your testing environment database with the following command:

```
npm run data-migrate:test
```



## Switch to another database (e.g. PostgreSQL, MySQL, SQL Server, MongoDB)

If you want to try this example with another database than SQLite, you can adjust the database connection in [`root.prisma`](./schema/root.prisma) by reconfiguring the `datasource` block.

### PostgreSQL

For PostgreSQL, the connection URL has the following structure:

```
datasource db {
  provider = "postgresql"
  url      = env("DB_URL")
}
```

And configure the [`DB_URL`](./env.development) as follows:
```
DB_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA" 
```

Here is an example connection string with a local PostgreSQL database:

```
DB_URL="postgresql://janedoe:mypassword@localhost:5432/notesapi?schema=public"
```

### MySQL

For MySQL, the connection URL has the following structure:

```
datasource db {
  provider = "mysql"
  url      = env("DB_URL")
}
```

And configure the [`DB_URL`](./env.development) as follows:
```
DB_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE" 
```

Here is an example connection string with a local MySQL database:

```
DB_URL="mysql://janedoe:mypassword@localhost:3306/notesapi"
```

### Microsoft SQL Server

Here is an example connection string with a local Microsoft SQL Server database:

```prisma
datasource db {
  provider = "sqlserver"
  url      = env("DB_URL")
}
```

And configure the [`DB_URL`](./env.development) as follows:
```
DB_URL="sqlserver://localhost:1433;initial catalog=sample;user=sa;password=mypassword;"
```

### MongoDB

Here is an example connection string with a local MongoDB database:

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DB_URL")
}
```

And configure the [`DB_URL`](./env.development) as follows:
```
DB_URL="mongodb://USERNAME:PASSWORD@HOST/DATABASE?authSource=admin&retryWrites=true&w=majority"
```



## Documentation

- Check out the [DataV5 docs](https://github.com/45592858/DataV5/wiki)



## Next steps

- If it's helpful to you, ` ⭐️ Star me`
- Feel free to Integrate above schema migration and data migration into your  DevOps, CI/CD process
- To report issues or contribute, please contact us at [gmyjm@qq.com](mailto:gmyjm@qq.com?subject=[GitHub]%20DataV5%20Supports) to help the tool more powerful
