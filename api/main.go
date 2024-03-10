package main

import (
	"fmt"
	"log"
	"net/http"
	"punchcard-api/admin"
	"punchcard-api/auth"
	"punchcard-api/db"
	"punchcard-api/shifts"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

// In-memory storage for simplicity (replace with a database in a real-world scenario).
var users = map[string]string{
	"example": "password",
}

func setupRoutes() *mux.Router {
	r := mux.NewRouter()

	// Define un-authed routes
	r.HandleFunc("/login", auth.LoginHandler).Methods("POST")

	// Define authed routes
	r.HandleFunc("/status", auth.ValidateToken(shifts.GetStatusHandler)).Methods("GET")
	r.HandleFunc("/clock-in", auth.ValidateToken(shifts.ClockInHandler)).Methods("POST")
	r.HandleFunc("/clock-out", auth.ValidateToken(shifts.ClockOutHandler)).Methods("POST")
	r.HandleFunc("/clock-notes", auth.ValidateToken(shifts.SaveNotesHandler)).Methods("PUT")
	r.HandleFunc("/shift-history/{month:[0-9]+}/{year:[0-9]+}", auth.ValidateToken(shifts.GetShiftHistoryHandler)).Methods("GET")
	r.HandleFunc("/users", auth.ValidateToken(admin.GetAllUsersHandler)).Methods("GET")

	return r
}

func main() {
	// Open a connection to the MySQL database
	db, err := db.ConnectToDB()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	r := setupRoutes()
	// FIX THIS (dont know if we should actually allow all)
	// when we use cors.Default() we get error on client about Access-control-allow-origin
	corsHandler := cors.AllowAll().Handler(r)

	// Start the server
	port := 8080
	fmt.Printf("Server listening on port %d...\n", port)
	err = http.ListenAndServe(fmt.Sprintf(":%d", port), corsHandler)
	if err != nil {
		fmt.Println("Error:", err)
	}
}
