package db

import (
	"database/sql"
	"fmt"
	"time"
)

var db *sql.DB

func ConnectToDB() (*sql.DB, error) {
	// Connection parameters
	dsn := "admin:admin@tcp(localhost:3306)/punchcard"

	// Open a connection to the MySQL database
	var err error
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

func GetUserCredentials(username string) (uint64, string, string, error) {
	_, err := db.Exec("CALL GetUserCredentials(?, @user_id, @user_hashed_password, @user_salt)", username)

	// Retrieve the output variables
	var id *uint64
	var hashPass *string
	var salt *string
	err = db.QueryRow("SELECT @user_id, @user_hashed_password, @user_salt").Scan(&id, &hashPass, &salt)
	if err != nil {
		return 0, "", "", err
	}

	return *id, *hashPass, *salt, nil
}

func GetFirstName(userID uint64) (string, error) {
	_, err := db.Exec("CALL GetFirstName(?, @first_name)", userID)
	if err != nil {
		return "", err
	}

	var firstName *string
	err = db.QueryRow("SELECT @first_name").Scan(&firstName)
	if err != nil {
		return "", err
	}

	return *firstName, nil
}

func GetClockInStatus(userID uint64) (bool, time.Time, string, error) {
	_, err := db.Exec("CALL GetClockInStatus(?, @clock_in_time, @notes)", userID)
	if err != nil {
		return false, time.Time{}, "", err
	}

	// Retrieve output
	var clockInTime, notes *string
	err = db.QueryRow("SELECT @clock_in_time, @notes").Scan(&clockInTime, &notes)
	if err != nil {
		return false, time.Time{}, "", err
	}

	// check if clocked in
	if clockInTime == nil && notes == nil {
		return false, time.Time{}, "", nil
	}

	parsed, err := time.Parse("2006-01-02 15:04:05", *clockInTime)
	return true, parsed, *notes, err
}

func ClockIn(userID uint64, clockInTime time.Time) error {
	_, err := db.Exec("CALL ClockIn(?, ?)", userID, clockInTime)
	return err
}

func ClockOut(userID uint64, clockInTime time.Time, notes string) error {
	_, err := db.Exec("CALL ClockOut(?, ?, ?)", userID, clockInTime, notes)
	return err
}

func UpdateNotes(userID uint64, notes string) error {
	fmt.Printf("CALL UpdateNotes(%d, %s)\n", userID, notes)
	_, err := db.Exec("CALL UpdateNotes(?, ?)", userID, notes)
	return err
}
