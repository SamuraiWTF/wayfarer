CREATE DATABASE oauth;
USE oauth;

-- Create the tables

CREATE TABLE clients (
    id VARCHAR(50) NOT NULL UNIQUE,
    secret VARCHAR(100)
    PRIMARY KEY (id)
);

CREATE TABLE auth_codes (
    auth_code VARCHAR(40) NOT NULL UNIQUE,
    expires_at DATE NOT NULL,
    redirect_uri VARCHAR(100) NOT NULL,
    client_id VARCHAR(50) NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (auth_code)
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

CREATE TABLE tokens (
    token VARCHAR(40) NOT NULL UNIQUE,
    expires_at DATE NOT NULL,
    client_id VARCHAR(50) NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (token)
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Seed the data

INSERT INTO clients (id, secret) VALUES (
    'wayfarer',
    'changeme'
);

-- Create App User

CREATE USER IF NOT EXISTS 'ticketapp' IDENTIFIED BY 't1ck3t0auth';

GRANT ALL PRIVILEGES ON oauth.* TO 'ticketapp'@'%';

FLUSH PRIVILEGES;