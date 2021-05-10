CREATE DATABASE tickets;
USE tickets;

-- Polyfill for UUID stuff.

DELIMITER $$

CREATE FUNCTION BIN_TO_UUID(b BINARY(16), f BOOLEAN)
RETURNS CHAR(36)
DETERMINISTIC
BEGIN
   DECLARE hexStr CHAR(32);
   SET hexStr = HEX(b);
   RETURN LOWER(CONCAT(
        IF(f,SUBSTR(hexStr, 9, 8),SUBSTR(hexStr, 1, 8)), '-',
        IF(f,SUBSTR(hexStr, 5, 4),SUBSTR(hexStr, 9, 4)), '-',
        IF(f,SUBSTR(hexStr, 1, 4),SUBSTR(hexStr, 13, 4)), '-',
        SUBSTR(hexStr, 17, 4), '-',
        SUBSTR(hexStr, 21)
    ));
END$$


CREATE FUNCTION UUID_TO_BIN(uuid CHAR(36), f BOOLEAN)
RETURNS BINARY(16)
DETERMINISTIC
BEGIN
  RETURN UNHEX(CONCAT(
  IF(f,SUBSTRING(uuid, 15, 4),SUBSTRING(uuid, 1, 8)),
  SUBSTRING(uuid, 10, 4),
  IF(f,SUBSTRING(uuid, 1, 8),SUBSTRING(uuid, 15, 4)),
  SUBSTRING(uuid, 20, 4),
  SUBSTRING(uuid, 25))
  );
END$$

DELIMITER ;

-- Create the tables

CREATE TABLE users 
    (id INT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT, 
     name VARCHAR(50) NOT NULL, 
     username VARCHAR(50) NOT NULL UNIQUE,
     salt VARCHAR(32),
     password VARCHAR(64),
     isadmin BOOLEAN NOT NULL DEFAULT false,
     PRIMARY KEY (id)
    );

CREATE TABLE teams (
    id INT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE team_memberships (
    user_id INT UNSIGNED NOT NULL,
    team_id INT UNSIGNED NOT NULL,
    role VARCHAR(20) NOT NULL,
    PRIMARY KEY(user_id, team_id),
    INDEX(user_id),
    INDEX(team_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);

CREATE TABLE tickets (
    id BINARY(16) UNIQUE PRIMARY KEY,
    title VARCHAR(128),
    body TEXT,
    team_id INT UNSIGNED NOT NULL,
    assigned_to INT UNSIGNED,
    status VARCHAR(24) NOT NULL DEFAULT 'open',
    created_by INT UNSIGNED,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NULL,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL -- For the case where a user is no longer.
);

CREATE TABLE ticket_comments (
    id INT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT PRIMARY KEY,
    ticket_id BINARY(16) NOT NULL,
    body TEXT,
    created_by INT UNSIGNED,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reply_to_comment INT UNSIGNED,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (reply_to_comment) REFERENCES ticket_comments(id) ON DELETE CASCADE
);

-- Seed the data

INSERT INTO users (name, username, salt, password, isadmin) VALUES (
    'Captain Beard', 
    'beard@wayfarertf.test', 
    'e03b2bf854d1454080846756c8f21c52', 
    '04a7e91bc9866e5401e6714e161b5f02b4ff47144254d84e9cda216e397d4734', -- Space Parrots arrr!
    true
), (
    'Quartermaster Sam',
    'sam@wayfarertf.test',
    '93c988ee7394418092123ed0e83dcff7',
    '633d9c7e0b01b3081dd3bdb2bc73c82c9ba43241151f71a81a4ab0f6a3a739f2', -- Captain Sam!
    false
), (
    'John the Cook',
    'john@wayfarertf.test',
    '0586f9e2255447f7907cd5d4ff356f08',
    '7aabd050bbedf28928a4a4839eff8fbdd567d6b517b9703dc408a987eaf52d23', -- I'm not the cook.
    false
);

INSERT INTO teams(name) VALUE (
    'Help Desk'
);

SET @help_desk_team_id = LAST_INSERT_ID();

INSERT INTO teams(name) VALUE (
    'Customer Support'
);

SET @cust_supp_team_id = LAST_INSERT_ID();

INSERT INTO team_memberships(user_id, team_id, role) VALUES (
    2,
    @help_desk_team_id,
    'owner'
),
(
     3,
     @help_desk_team_id,
     'member'
),(
    1,
    @cust_supp_team_id,
    'owner'
),(
    2,
    @cust_supp_team_id,
    'manager'
),(
    3,
    @cust_supp_team_id,
    'member'
);

INSERT INTO tickets (id, title, body, team_id, assigned_to, status, created_by, due_date) VALUES (
    UUID_TO_BIN(UUID(), 1),
    'Virus scanner blocking notepad++',
    'The virus scanner keeps flagging my notepad++ app whenever I open it. I''m also having issues accessing my Documents folder.',
    @help_desk_team_id,
    2,
    'open',
    3,
    CURRENT_TIMESTAMP
);

-- Create App User

CREATE USER IF NOT EXISTS 'ticketapp' IDENTIFIED BY 't1ck3tw1ck3t';

GRANT ALL PRIVILEGES ON tickets.* TO 'ticketapp'@'%';

FLUSH PRIVILEGES;