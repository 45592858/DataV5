-- This is a example of a data migration file.
-- It is used to initialize the database with some data.
-- It is used to all environments(dev, test, prod).
-- It only supports commands: INSERT|UPDATE|DELETE|SELECT|MERGE|REPLACE|CALL|EXECUTE|EXEC|SET

INSERT INTO User (id,email,name) VALUES (1, 'user1@example.com', 'User 1');
INSERT INTO User (id,email,name) VALUES (2, 'user2@example.com', 'User 2');
INSERT INTO User (id,email,name) VALUES (3, 'user3@example.com', 'User 3');

INSERT INTO Post (id,title,content,authorId) VALUES (1, 'Post 1', 'Content 1', 1);
INSERT INTO Post (id,title,content,authorId) VALUES (2, 'Post 2', 'Content 2', 2);
INSERT INTO Post (id,title,content,authorId) VALUES (3, 'Post 3', 'Content 3', 3);

