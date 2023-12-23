package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"punchcard-api/auth"
	"punchcard-api/db"
	"time"

	"github.com/dgrijalva/jwt-go"
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
	}

	if !ok {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	// Generate a JWT token.
	expirationTime := time.Now().Add(5 * time.Minute)
	claims := &auth.Claims{
		UserID: fmt.Sprint(userID),
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(auth.SecretKey)
	if err != nil {
		http.Error(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	// Respond with a JSON object containing the token and a custom message.
	response := map[string]interface{}{
		"token":   tokenString,
		"message": "Login successful",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// ProtectedHandler is a sample protected route that requires a valid JWT.
func ProtectedHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "This is a protected route.")
}

func setupRoutes() (*mux.Router) {
	r := mux.NewRouter()

	// Define routes
	r.HandleFunc("/login", LoginHandler).Methods("POST")
	r.HandleFunc("/protected", auth.ValidateToken(ProtectedHandler)).Methods("GET")

	return r
}

func main() {
	// Open a connection to the MySQL database
	db, err := db.ConnectToDB()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	corsHandler := cors.Default().Handler(http.DefaultServeMux)

	// Start the server
	port := 8080
	fmt.Printf("Server listening on port %d...\n", port)
	http.Handle("/", setupRoutes())
	err = http.ListenAndServe(fmt.Sprintf(":%d", port), corsHandler)
	if err != nil {
		fmt.Println("Error:", err)
	}
}


