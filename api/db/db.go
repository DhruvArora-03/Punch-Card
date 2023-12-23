package db

import (
	"database/sql"
)

var db *sql.DB
var getUserCredentials *sql.Stmt

func GetUserCredentials(username string) (int64, string, string, error) {
	rows, err := db.Query("CALL GetUserCredentials(?, @user_id, @user_hashed_password, @user_salt)", username)
	if err != nil {
		return -1, "", "", err
	}
	defer rows.Close()

	for rows.Next() {
		// nothing????? for some reason doesn't work without this loop
	}

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

