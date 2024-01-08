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

func parseNotes(notes sql.NullString) (string) {
	if notes.Valid {
		return notes.String
	}

	return ""
}

func GetClockInStatus(userID string) (bool, time.Time, string, error) {
	_, err := db.Exec("CALL GetClockInStatus(?, @clock_in_time, @notes)", userID)
	if err != nil {
		return false, time.Time{}, "", err
	}

	// Retrieve output
	var clockInTime, notes sql.NullString
	err = db.QueryRow("SELECT @clock_in_time, @notes").Scan(&clockInTime, &notes)
	if err != nil {
		return false, time.Time{}, "", err
	}

	// check if clocked in
	if !clockInTime.Valid && !notes.Valid {
		return false, time.Time{}, "", nil
	}

	parsed, err := time.Parse("2006-01-02 15:04:05", clockInTime.String)
	return true, parsed, parseNotes(notes), err
}

func ClockIn(userID string, clockInTime time.Time) (error) {
	_, err := db.Exec("CALL ClockIn(?, ?)", userID, clockInTime)
	return err
}

func ClockOut(userID string, clockInTime time.Time, notes string) (error) {
	_, err := db.Exec("CALL ClockOut(?, ?, ?)", userID, clockInTime, notes)
	return err
}

func UpdateNotes(userID string, notes string) (error) {
	fmt.Printf("CALL UpdateNotes(%s, %s)\n", userID, notes)
	_, err := db.Exec("CALL UpdateNotes(?, ?)", userID, notes)
	return err
}