CREATE DATABASE tickets;
USE tickets;

CREATE TABLE pet (name VARCHAR(20), owner VARCHAR(20),
       species VARCHAR(20), sex CHAR(1), birth DATE, death DATE);

CREATE TABLE users 
    (id INT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT, 
     name VARCHAR(50) NOT NULL, 
     username VARCHAR(50) NOT NULL UNIQUE,
     salt VARCHAR(32),
     password VARCHAR(64),
     isadmin BOOLEAN NOT NULL DEFAULT false,
     PRIMARY KEY (id)
    );

INSERT INTO users (name, username, salt, password, isadmin) VALUES (
    'Captain Beard', 
    'beard@wayfarertf.test', 
    'e03b2bf854d1454080846756c8f21c52', 
    '04a7e91bc9866e5401e6714e161b5f02b4ff47144254d84e9cda216e397d4734', -- 'Space Parrots arrr!'
    true
    ) ;

CREATE USER IF NOT EXISTS 'ticketapp' IDENTIFIED BY 't1ck3tw1ck3t';

GRANT ALL PRIVILEGES ON tickets.* TO 'ticketapp'@'%';

FLUSH PRIVILEGES;