-- @block drop all tables
DROP TABLE users;
DROP TABLE shifts;
DROP TABLE paychecks;



-- @block Create User Table
CREATE TABLE `users`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(55) NOT NULL UNIQUE,
    `password` VARCHAR(55) NOT NULL,
    `first_name` VARCHAR(55) NOT NULL,
    `last_name` VARCHAR(55) NOT NULL,
    `hourly_pay` DECIMAL(6, 4) NOT NULL,
    `is_admin` TINYINT(1) NOT NULL,
    `payment_method` VARCHAR(255) NOT NULL
);


-- @block Create Paycheck Table
CREATE TABLE `paychecks`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `hours_worked` DECIMAL(7, 4) NOT NULL,
    `payment_amount` DECIMAL(9, 4) NOT NULL,
    `payment_date` DATE NOT NULL,
    `payment_method` VARCHAR(255) NOT NULL,
    FOREIGN KEY(`user_id`) REFERENCES `users`(`id`)
);

-- @block Create Shift Table
CREATE TABLE `shifts`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NOT NULL,
    `paycheck_id` INT UNSIGNED NOT NULL,
    `clock_in` DATETIME NOT NULL,
    `clock_out` DATETIME NULL,
    `employee_notes` TEXT NULL,
    `admin_notes` TEXT NULL,
    FOREIGN KEY(`paycheck_id`) REFERENCES `paychecks`(`id`),
    FOREIGN KEY(`user_id`) REFERENCES `users`(`id`)
);