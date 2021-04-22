CREATE DATABASE tickets;
USE tickets;

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
    -- owner_id INT UNSIGNED,
    PRIMARY KEY (id)
    -- FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
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
);

CREATE USER IF NOT EXISTS 'ticketapp' IDENTIFIED BY 't1ck3tw1ck3t';

GRANT ALL PRIVILEGES ON tickets.* TO 'ticketapp'@'%';

FLUSH PRIVILEGES;