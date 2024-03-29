CREATE DATABASE oauth;
USE oauth;

-- Create the tables

CREATE TABLE clients (
    id VARCHAR(50) NOT NULL UNIQUE,
    secret VARCHAR(100),
    connection_info TEXT,
    PRIMARY KEY (id)
);

CREATE TABLE auth_codes (
    auth_code VARCHAR(40) NOT NULL,
    expires_at BIGINT NOT NULL,
    client_id VARCHAR(50) NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (client_id, user_id),
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

CREATE TABLE tokens (
    is_admin BOOLEAN NOT NULL,
    expires_at BIGINT NOT NULL,
    client_id VARCHAR(50) NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (client_id, user_id),
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Seed the data

INSERT INTO clients (id, secret) VALUES (
    'wayfarer',
    'anthropogenic'
);

INSERT INTO auth_codes (auth_code, expires_at, client_id, user_id) VALUES (
    '662b19c05643d738ab4c36bdc1bf25bebcfdeac7',
    1610159424,
    'wayfarer',
    2
);

-- Create App User

CREATE USER IF NOT EXISTS 'ticketapp' IDENTIFIED BY 't1ck3t0auth';

GRANT ALL PRIVILEGES ON oauth.* TO 'ticketapp'@'%';

FLUSH PRIVILEGES;
