-- This is a example of a data migration file.
-- It is used to initialize the database with some data.
-- It is used to dev environment.
-- It only supports commands: INSERT|UPDATE|DELETE|SELECT|MERGE|REPLACE|CALL|EXECUTE|EXEC|SET

INSERT INTO User (id,email,name) VALUES (4, 'user4@example.com', 'User 4');
INSERT INTO User (id,email,name) VALUES (5, 'user5@example.com', 'User 5');
INSERT INTO User (id,email,name) VALUES (6, 'user6@example.com', 'User 6');

INSERT INTO Post (id,title,content,authorId) VALUES (4, 'Post 4', 'Content 4', 4);
INSERT INTO Post (id,title,content,authorId) VALUES (5, 'Post 5', 'Content 5', 5);
INSERT INTO Post (id,title,content,authorId) VALUES (6, 'Post 6', 'Content 6', 6);

