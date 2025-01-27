CREATE TABLE users (
                       id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid(),
                       username VARCHAR(255) NOT NULL,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL
);
