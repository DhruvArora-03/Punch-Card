--@block create procedures
-- Input: username
-- Output: corresponding id, hashed_password, and salt
DROP PROCEDURE IF EXISTS GetUserCredentials;
CREATE PROCEDURE GetUserCredentials(
    IN in_username VARCHAR(63),
    OUT user_id_result BIGINT UNSIGNED,
    OUT hashed_password_result VARCHAR(63),
    OUT salt_result VARCHAR(63),
    OUT role_result VARCHAR(63),
    OUT first_name_result VARCHAR(63)
) BEGIN -- Retrieve user credentials based on the provided username
SELECT id,
    hashed_password,
    salt,
    role,
    first_name INTO user_id_result,
    hashed_password_result,
    salt_result,
    role_result,
    first_name_result
FROM users
WHERE username = in_username;
END;
-- Input: username, hashed_password, salt, first_name, last_name, hourly_pay_cents, role, preferred_payment_method, creator_id
-- Output: None
DROP PROCEDURE IF EXISTS CreateUser;
CREATE PROCEDURE CreateUser(
    IN in_username VARCHAR(63),
    IN in_hashed_password VARCHAR(63),
    IN in_salt VARCHAR(63),
    IN in_first_name VARCHAR(63),
    IN in_last_name VARCHAR(63),
    IN in_hourly_pay_cents SMALLINT UNSIGNED,
    IN in_role VARCHAR(63),
    IN in_preferred_payment_method VARCHAR(255),
    IN in_creator_id BIGINT UNSIGNED
) BEGIN -- Insert the new user into the 'users' table
INSERT INTO users (
        username,
        hashed_password,
        salt,
        first_name,
        last_name,
        hourly_pay_cents,
        role,
        preferred_payment_method,
        createdBy,
        createdAt,
        updatedBy,
        updatedAt
    )
VALUES (
        in_username,
        in_hashed_password,
        in_salt,
        in_first_name,
        in_last_name,
        in_hourly_pay_cents,
        in_role,
        in_preferred_payment_method,
        in_creator_id,
        UTC_TIMESTAMP(),
        in_creator_id,
        UTC_TIMESTAMP()
    );
END;
DROP PROCEDURE IF EXISTS GetClockInStatus;
CREATE PROCEDURE GetClockInStatus (
    IN in_user_id BIGINT UNSIGNED,
    OUT clock_in_time_result DATETIME,
    OUT notes_result TINYTEXT
) BEGIN
SELECT clock_in,
    user_notes INTO clock_in_time_result,
    notes_result
FROM shifts
WHERE user_id = in_user_id
    AND clock_out IS NULL;
END;
DROP PROCEDURE IF EXISTS ClockIn;
CREATE PROCEDURE ClockIn (
    IN in_user_id BIGINT UNSIGNED,
    IN in_clock_in DATETIME
) BEGIN
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
    )
VALUES (
        in_user_id,
        NULL,
        in_clock_in,
        NULL,
        "",
        "",
        in_user_id,
        UTC_TIMESTAMP(),
        in_user_id,
        UTC_TIMESTAMP()
    );
END;
DROP PROCEDURE IF EXISTS ClockOut;
CREATE PROCEDURE ClockOut (
    IN in_user_id BIGINT UNSIGNED,
    IN in_clock_out DATETIME,
    IN in_notes TINYTEXT
) BEGIN
UPDATE shifts
SET clock_out = in_clock_out,
    user_notes = in_notes,
    updatedBy = in_user_id,
    updatedAt = UTC_TIMESTAMP()
WHERE user_id = in_user_id
-- Only update if the shift has not been clocked out before
    AND clock_out IS NULL;
END;
DROP PROCEDURE IF EXISTS UpdateNotes;
CREATE PROCEDURE UpdateNotes (
    IN in_user_id BIGINT UNSIGNED,
    IN in_notes TINYTEXT
) BEGIN
UPDATE shifts
SET user_notes = in_notes,
    updatedBy = in_user_id,
    updatedAt = UTC_TIMESTAMP()
WHERE user_id = in_user_id
    AND clock_out IS NULL;
END;
DROP PROCEDURE IF EXISTS GetShiftHistory;
CREATE PROCEDURE GetShiftHistory(
    IN in_user_id BIGINT UNSIGNED,
    IN lower_bound DATETIME,
    IN upper_bound DATETIME
) BEGIN
SELECT clock_in,
    clock_out,
    user_notes,
    admin_notes
FROM shifts
WHERE user_id = in_user_id
    AND clock_in >= lower_bound
    AND clock_out <= upper_bound;
END;
DROP PROCEDURE IF EXISTS GetAllUsers;
CREATE PROCEDURE GetAllUsers() BEGIN
SELECT id,
    username,
    first_name,
    last_name,
    hourly_pay_cents,
    role,
    preferred_payment_method
FROM users;
END;
DROP PROCEDURE IF EXISTS GetUser;
CREATE PROCEDURE GetUser(
    IN in_user_id BIGINT UNSIGNED,
    OUT username_result VARCHAR(63),
    OUT first_name_result VARCHAR(63),
    OUT last_name_result VARCHAR(63),
    OUT hourly_pay_cents_result SMALLINT UNSIGNED,
    OUT role_result VARCHAR(63),
    OUT preferred_payment_method_result VARCHAR(255)
) BEGIN
SELECT username,
    first_name,
    last_name,
    hourly_pay_cents,
    role,
    preferred_payment_method INTO username_result,
    first_name_result,
    last_name_result,
    hourly_pay_cents_result,
    role_result,
    preferred_payment_method_result
FROM users
WHERE id = in_user_id;
END;
DROP PROCEDURE IF EXISTS GetUserRole;
CREATE PROCEDURE GetUserRole(
    IN in_user_id BIGINT UNSIGNED,
    OUT role_result VARCHAR(63)
) BEGIN
SELECT role INTO role_result
FROM users
WHERE id = in_user_id;
END;
DROP PROCEDURE IF EXISTS UpdateUser;
CREATE PROCEDURE UpdateUser(
    IN in_user_id BIGINT UNSIGNED,
    IN in_username VARCHAR(63),
    IN in_first_name VARCHAR(63),
    IN in_last_name VARCHAR(63),
    IN in_hourly_pay_cents SMALLINT UNSIGNED,
    IN in_role VARCHAR(63),
    IN in_preferred_payment_method VARCHAR(255),
    IN in_updater_id BIGINT UNSIGNED
) BEGIN -- Insert the new user into the 'users' table
UPDATE users
SET username = in_username,
    first_name = in_first_name,
    last_name = in_last_name,
    hourly_pay_cents = in_hourly_pay_cents,
    role = in_role,
    preferred_payment_method = in_preferred_payment_method,
    updatedBy = in_updater_id,
    updatedAt = UTC_TIMESTAMP()
WHERE id = in_user_id;
END;