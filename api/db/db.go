package db

import (
	"database/sql"
	"time"
	"errors"
)

var db *sql.DB

func ConnectToDB() (*sql.DB, error) {
	// Connection parameters
	dsn := "admin:admin@tcp(localhost:3306)/punchcard"

	// Open a connection to the MySQL database
	var err error;
	db, err = sql.Open("mysql", dsn)
	if err != nil {
		return nil, err
	}

	// Test the connection
	err = db.Ping()
	if err != nil {
		return nil, err
	}

	return db, nil
}

func GetUserCredentials(username string) (int64, string, string, error) {
	_, err := db.Exec("CALL GetUserCredentials(?, @user_id, @user_hashed_password, @user_salt)", username)

	// Retrieve the output variables
	var id sql.NullInt64
	var hashPass sql.NullString
	var salt sql.NullString
	err = db.QueryRow("SELECT @user_id, @user_hashed_password, @user_salt").Scan(&id, &hashPass, &salt)
	if err != nil {
		return -1, "", "", err
	}

	// fmt.Println(id.Valid)
	// fmt.Println(hashPass.Valid)
	// fmt.Println(salt.Valid)

	return id.Int64, hashPass.String, salt.String, nil
}

func GetFirstName(userID string) (string, error) {
	_, err := db.Exec("CALL GetFirstName(?, @first_name)", userID)
	if err != nil {
		return "", err
	}

	var firstName sql.NullString
	err = db.QueryRow("SELECT @first_name").Scan(&firstName)
	if err != nil {
		return "", err
	}

	return firstName.String, nil
}

func GetClockInStatus(userID string) (bool, time.Time, error) {
	_, err := db.Exec("CALL GetClockInStatus(?, @clock_in_time)", userID)
	if err != nil {
		return false, time.Time{}, err
	}

	// Retrieve output
	var clockInTime sql.NullString
	err = db.QueryRow("SELECT @clock_in_time").Scan(&clockInTime)
	if err != nil {
		return false, time.Time{}, err
	}

	if !clockInTime.Valid {
		return false, time.Time{}, errors.New("sql procedure returned invalid")
	}

	parsed, err := time.Parse("2006-01-02 15:04:05", clockInTime.String)
	return true, parsed, err
}

func ClockIn(userID string, clockInTime time.Time) (error) {
	_, err := db.Exec("CALL ClockIn(?, ?)", userID, clockInTime)
	return err
}

func ClockOut(userID string, clockInTime time.Time) (error) {
	_, err := db.Exec("CALL ClockOut(?, ?)", userID, clockInTime)
	return err
}