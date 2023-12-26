-- @block create tables
DROP TABLE IF EXISTS shifts;
DROP TABLE IF EXISTS paychecks;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(63) NOT NULL UNIQUE,
    hashed_password VARCHAR(63) NOT NULL,
    salt VARCHAR(63) NOT NULL,
    first_name VARCHAR(63) NOT NULL,
    last_name VARCHAR(63) NOT NULL,
    hourly_pay DECIMAL(8, 2) NOT NULL,
    role VARCHAR(63) NOT NULL,
    preferred_payment_method VARCHAR(255) NOT NULL,
    createdBy BIGINT UNSIGNED NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedBy BIGINT UNSIGNED NOT NULL,
    updatedAt DATETIME NOT NULL
);

CREATE TABLE paychecks (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    hours_worked DECIMAL(8, 2) NOT NULL,
    payment_amount DECIMAL(8, 2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(255) NOT NULL,
    createdBy BIGINT UNSIGNED NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedBy BIGINT UNSIGNED NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE shifts (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    paycheck_id BIGINT UNSIGNED NULL,
    clock_in DATETIME NOT NULL,
    clock_out DATETIME NULL,
    user_notes TEXT NULL,
    admin_notes TEXT NULL,
    createdBy BIGINT UNSIGNED NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedBy BIGINT UNSIGNED NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY(paycheck_id) REFERENCES paychecks(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE INDEX idx_user_id ON shifts (user_id);
CREATE INDEX idx_user_id ON paychecks (user_id);

-- @block create procedures

-- Input: username
-- Output: corresponding id, hashed_password, and salt
DROP PROCEDURE IF EXISTS GetUserCredentials;
CREATE PROCEDURE GetUserCredentials(
    IN in_username VARCHAR(63),
    OUT user_id_result BIGINT UNSIGNED,
    OUT hashed_password_result VARCHAR(63),
    OUT user_salt_result VARCHAR(63)
)
BEGIN
    -- Retrieve user credentials based on the provided username
    SELECT id, hashed_password, salt
    INTO user_id_result, hashed_password_result, user_salt_result
    FROM users
    WHERE username = in_username;
END;

-- Input: username, hashed_password, salt, first_name, last_name, hourly_pay, role, preferred_payment_method, creator_id
-- Output: None
DROP PROCEDURE IF EXISTS CreateUser;
CREATE PROCEDURE CreateUser(
    IN in_username VARCHAR(63),
    IN in_hashed_password VARCHAR(63),
    IN in_salt VARCHAR(63),
    IN in_first_name VARCHAR(63),
    IN in_last_name VARCHAR(63),
    IN in_hourly_pay DECIMAL(8, 2),
    IN in_role VARCHAR(63),
    IN in_preferred_payment_method VARCHAR(255),
    IN in_creator_id BIGINT UNSIGNED
)
BEGIN
    -- Insert the new user into the 'users' table
    INSERT INTO users (
        username,
        hashed_password,
        salt,
        first_name,
        last_name,
        hourly_pay,
        role,
        preferred_payment_method,
        createdBy,
        createdAt,
        updatedBy,
        updatedAt
    ) VALUES (
        in_username,
        in_hashed_password,
        in_salt,
        in_first_name,
        in_last_name,
        in_hourly_pay,
        in_role,
        in_preferred_payment_method,
        in_creator_id,
        UTC_TIMESTAMP(),
        in_creator_id,
        UTC_TIMESTAMP()
    );
END;

DROP PROCEDURE IF EXISTS ClockIn;
CREATE PROCEDURE ClockIn (
    IN in_user_id BIGINT UNSIGNED,
    IN in_clock_in DATETIME
)
BEGIN
    INSERT INTO shifts (
        user_id,
        paycheck_id,
        clock_in,
        clock_out,
        user_notes,
        admin_notes,
        createdBy,
        createdAt,
        updatedBy,
        updatedAt
    ) VALUES (
        in_user_id,
        NULL,
        in_clock_in,
        NULL,
        NULL,
        NULL,
        in_user_id,
        UTC_TIMESTAMP(),
        in_user_id,
        UTC_TIMESTAMP()
    );
END;

DROP PROCEDURE IF EXISTS ClockOut;
CREATE PROCEDURE ClockOut (
    IN in_user_id BIGINT UNSIGNED,
    IN in_clock_out DATETIME
)
BEGIN
    UPDATE shifts
    SET
        clock_out = in_clock_out,
        updatedBy = in_user_id,
        updatedAt = UTC_TIMESTAMP()
    WHERE
        user_id = in_user_id AND
        clock_out IS NULL; -- Only update if the shift has not been clocked out before
END;

DROP PROCEDURE IF EXISTS GetClockInStatus;
CREATE PROCEDURE GetClockInStatus (
    IN in_user_id BIGINT UNSIGNED,
    OUT clock_in_time_result DATETIME
)
BEGIN
    SELECT clock_in
    INTO clock_in_time_result
    FROM shifts
    WHERE 
        user_id = in_user_id AND
        clock_out IS NULL;
END;

DROP PROCEDURE IF EXISTS GetFirstName;
CREATE PROCEDURE GetFirstName (
    IN in_user_id BIGINT UNSIGNED,
    OUT first_name_result VARCHAR(63)
)
BEGIN
    SELECT first_name
    INTO first_name_result
    FROM users
    WHERE id = in_user_id;
END;

-- @block
SELECT * from users

-- @block
SELECT * from shifts
