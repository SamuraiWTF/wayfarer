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
    due_date DATE NULL,
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
), (
    'Samurai Test Admin',
    'samurai_admin',
    '5a81ab44f1da42dda85494fa6c23547d',
    'ab18ac755f36e1afafd2845dc2a68e3ee76272917b012906d61a098534853af2',
    true
), (
    'Samurai Test Manager',
    'samurai_manager',
    '5a81ab44f1da42dda85494fa6c23547d',
    'ab18ac755f36e1afafd2845dc2a68e3ee76272917b012906d61a098534853af2',
    false
), (
    'Samurai Test User',
    'samurai',
    '5a81ab44f1da42dda85494fa6c23547d',
    'ab18ac755f36e1afafd2845dc2a68e3ee76272917b012906d61a098534853af2',
    false
)
;

INSERT INTO teams(name) VALUE (
    'Help Desk'
);

SET @help_desk_team_id = LAST_INSERT_ID();

INSERT INTO teams(name) VALUE (
    'Customer Support'
);

SET @cust_supp_team_id = LAST_INSERT_ID();

INSERT INTO teams(name) VALUE (
    'Pen Test'
);

SET @pen_test_team_id = LAST_INSERT_ID();

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
),(
    4,
    @pen_test_team_id,
    'owner'
),(
    5,
    @pen_test_team_id,
    'manager'
),(
    6,
    @pen_test_team_id,
    'member'
),(
    4,
    @cust_supp_team_id,
    'manager'
),(
    5,
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
    CURRENT_DATE()
),(
    UUID_TO_BIN(UUID(), 1),
    'New account creation',
    'I need to create a new member account for my team. What does the process look like for this?',
    @cust_supp_team_id,
    NULL,
    'open',
    2,
    CURRENT_DATE()
),(
    UUID_TO_BIN(UUID(), 1),
    'Communication and contact methods',
    'I have called the head office, but I received no reply. I am in a different timezone; what would be the best method of contact?',
    @cust_supp_team_id,
    1,
    'open',
    1,
    CURRENT_DATE()
),(
    UUID_TO_BIN(UUID(), 1),
    'Filtering not working as intended',
    'The filter bar for tickets is not fully fleshed out. Among other errors, sorting by unassigned user has no effect.',
    @help_desk_team_id,
    2,
    'closed',
    3,
    CURRENT_DATE()
),(
    UUID_TO_BIN(UUID(), 1),
    'Password reset',
    'I need to reset the password for my account.',
    @cust_supp_team_id,
    3,
    'open',
    2,
    '2021-05-26'
),(
    UUID_TO_BIN(UUID(), 1),
    'Remove user account',
    'Our team has a user that is no longer with us and we want to entirely remove the account from the system.',
    @cust_supp_team_id,
    1,
    'closed',
    3,
    '2021-06-01'
),(
    UUID_TO_BIN(UUID(), 1),
    'View account details for members of team',
    'A useful feature would be for owners to be able to view info about their team members. In the meantime, any way of doing this?',
    @cust_supp_team_id,
    2,
    'open',
    2,
    CURRENT_DATE()
),(
    UUID_TO_BIN(UUID(), 1),
    'Inaccuracte ticket counts for team',
    'When browsing by team view, the counts for "open", "unassigned", etc do not seem to be correct.',
    @help_desk_team_id,
    NULL,
    'closed',
    3,
    CURRENT_DATE()
);

-- Create App User

CREATE USER IF NOT EXISTS 'ticketapp' IDENTIFIED BY 't1ck3tw1ck3t';

GRANT ALL PRIVILEGES ON tickets.* TO 'ticketapp'@'%';

FLUSH PRIVILEGES;