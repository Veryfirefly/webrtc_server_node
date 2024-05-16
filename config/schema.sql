CREATE TABLE user
(
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    phone       TEXT NOT NULL,
    password    TEXT NOT NULL,
    avatar      TEXT NOT NULL,
    name        TEXT NOT NULL,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    modify_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (phone),
    UNIQUE (name)
);
