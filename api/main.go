package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"punchcard-api/auth"
	"punchcard-api/db"
	"punchcard-api/shifts"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

// In-memory storage for simplicity (replace with a database in a real-world scenario).
var users = map[string]string{
	"example": "password",
}

// LoginHandler handles user login and generates a JWT upon successful login.
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println(time.Now())
	fmt.Printf("%s ~/login\n\n", r.Method)
	time.Sleep(2 * time.Second)
	
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// the expected request body
	var request struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	
	// check if body matches
	err := json.NewDecoder(r.Body).Decode(&request);
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Check if the username and password are valid.
	userID, hashedPass, salt, err := db.GetUserCredentials(request.Username)
	if err != nil {
		http.Error(w, "database issue", http.StatusInternalServerError)
	}

	ok, err := auth.CheckPassword(hashedPass, request.Password, salt)
	if err != nil {
		http.Error(w, "internal issue", http.StatusInternalServerError)
		return
	} else if !ok {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	// Generate a JWT token.
	tokenString, err := auth.GenerateJWT(fmt.Sprint(userID))
	if err != nil {
		http.Error(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	// Respond with just the token string.
	w.Header().Set("Content-Type", "text/plain")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(tokenString))
}

// ProtectedHandler is a sample protected route that requires a valid JWT.
func ProtectedHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println(time.Now())
	fmt.Printf("%s ~/protected\n\n", r.Method)
	time.Sleep(time.Second)
	fmt.Fprintf(w, "This is a protected route.")
}

func setupRoutes() (*mux.Router) {
	r := mux.NewRouter()

	// Define routes
	r.HandleFunc("/login", LoginHandler).Methods("POST")
	r.HandleFunc("/protected", auth.ValidateToken(ProtectedHandler)).Methods("GET")
	r.HandleFunc("/clock-in", auth.ValidateToken(shifts.ClockInHandler)).Methods("POST")

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


