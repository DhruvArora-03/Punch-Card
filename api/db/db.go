package db

import (
	"database/sql"
	"fmt"
	"log"
	"punchcard-api/types"
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

func GetUserCredentials(username string) (uint64, string, string, string, string, error) {
	_, err := db.Exec("CALL GetUserCredentials(?, @user_id, @user_hashed_password, @user_salt, @user_role, @user_first_name)", username)

	// Retrieve the output variables
	var id *uint64
	var hashPass, salt, role, firstName *string
	err = db.QueryRow("SELECT @user_id, @user_hashed_password, @user_salt, @user_role, @user_first_name").Scan(&id, &hashPass, &salt, &role, &firstName)
	if err != nil || id == nil || hashPass == nil || salt == nil || role == nil || firstName == nil {
		return 0, "", "", "", "", err
	}

	return *id, *hashPass, *salt, *role, *firstName, nil
}

func parseSqlTime(sqlTime string) (time.Time, error) {
	return time.Parse("2006-01-02 15:04:05", sqlTime)
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

	parsed, err := parseSqlTime(*clockInTime)
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
	_, err := db.Exec("CALL UpdateNotes(?, ?)", userID, notes)
	return err
}

func generateBounds(month int, year int) (time.Time, time.Time) {
	if month == 0 {
		return time.Date(year, time.January, 1, 0, 0, 0, 0, time.UTC), time.Date(year+1, time.January, 1, 0, 0, 0, 0, time.UTC)
	}

	return time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC), time.Date(year, time.Month(month+1), 1, 0, 0, 0, 0, time.UTC)
}

func GetShiftHistory(userID uint64, month int, year int) ([]types.ShiftHistoryResult, error) {
	start, end := generateBounds(month, year)
	log.Println(month, time.Month(month))
	log.Println(year)
	log.Println(start)
	log.Println(end)
	rows, err := db.Query("CALL GetShiftHistory(?, ?, ?)", userID, start, end)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	var results []types.ShiftHistoryResult

	// Iterate over rows
	for rows.Next() {
		var result types.ShiftHistoryResult
		var clockIn, clockOut *string

		// Scan the values from the current row into the struct fields
		err := rows.Scan(&clockIn, &clockOut, &result.UserNotes, &result.AdminNotes)
		if err != nil {
			log.Fatal(err)
		}

		result.ClockIn, err = parseSqlTime(*clockIn)
		if err != nil {
			log.Fatal(err)
		}

		result.ClockOut, err = parseSqlTime(*clockOut)
		if err != nil {
			log.Fatal(err)
		}

		// Append the struct to the slice
		results = append(results, result)
	}

	// Check for errors from iterating over rows
	if err := rows.Err(); err != nil {
		log.Fatal(err)
	}

	return results, err
}

func GetAllUsers(userID uint64) ([]types.UserDataResult, error) {
	rows, err := db.Query("CALL GetAllUsers()")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	var results []types.UserDataResult

	// Iterate over rows
	for rows.Next() {
		var result types.UserDataResult

		// Scan the values from the current row into the struct fields
		err := rows.Scan(&result)
		if err != nil {
			log.Fatal(err)
		}

		fmt.Println(result)
		// Append the struct to the slice
		results = append(results, result)
	}

	// Check for errors from iterating over rows
	if err := rows.Err(); err != nil {
		log.Fatal(err)
	}

	return results, err
}
