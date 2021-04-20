CREATE DATABASE tickets;
USE tickets;

CREATE TABLE pet (name VARCHAR(20), owner VARCHAR(20),
       species VARCHAR(20), sex CHAR(1), birth DATE, death DATE);

CREATE USER IF NOT EXISTS 'ticketapp' IDENTIFIED BY 't1ck3tw1ck3t';

GRANT ALL PRIVILEGES ON tickets.* TO 'ticketapp'@'%';

FLUSH PRIVILEGES;