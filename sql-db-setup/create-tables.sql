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
    user_notes TINYTEXT NULL,
    admin_notes TINYTEXT NULL,
    createdBy BIGINT UNSIGNED NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedBy BIGINT UNSIGNED NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY(paycheck_id) REFERENCES paychecks(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE INDEX idx_user_id ON shifts (user_id);
CREATE INDEX idx_user_id ON paychecks (user_id);