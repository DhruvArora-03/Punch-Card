-- @block create tables
CREATE TABLE users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(55) NOT NULL UNIQUE,
    password VARCHAR(55) NOT NULL,
    salt VARCHAR(55) NOT NULL,
    first_name VARCHAR(55) NOT NULL,
    last_name VARCHAR(55) NOT NULL,
    hourly_pay DECIMAL(8, 2) NOT NULL,
    role VARCHAR(55) NOT NULL,
    preferred_payment_method VARCHAR(255) NULL,
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

-- -- @block
-- CREATE FUNCTION 