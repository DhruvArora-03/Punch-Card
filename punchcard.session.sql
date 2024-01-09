-- @block
SELECT *
FROM users;
-- @block
SELECT *
FROM shifts;
-- @block
SELECT *
FROM paychecks;

-- @block
CALL GetShiftHistory(1, '1000-01-01 00:00:00', '9999-12-31 23:59:59');
