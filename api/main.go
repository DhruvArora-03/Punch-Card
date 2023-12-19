package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
)

var secretKey = []byte("change-this-to-an-actual-secret-key-later-because-this-is-not-very-secure-like-this-or-something-like-that-but-tbh-there's-no-way-that-anyone-ever-guesses-this-so-maybe-it-is-fine")

// User represents a simple user structure for demonstration purposes.
type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// Claims represents the structure of JWT claims.
type Claims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

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

	var user User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Check if the username and password are valid.
	password, ok := users[user.Username]
	if !ok || password != user.Password {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	// Generate a JWT token.
	expirationTime := time.Now().Add(5 * time.Minute)
	claims := &Claims{
		Username: user.Username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(secretKey)
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

func main() {
	r := mux.NewRouter()

	// Define routes
	r.HandleFunc("/login", LoginHandler).Methods("POST")
	r.HandleFunc("/protected", ValidateToken(ProtectedHandler)).Methods("GET")

	// Start the server
	port := 8080
	fmt.Printf("Server listening on port %d...\n", port)
	http.Handle("/", r)
	http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
}

// ValidateToken is a middleware function to validate JWT tokens.
func ValidateToken(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// Check if the header has the "Bearer " prefix
		if !strings.HasPrefix(authHeader, "Bearer ") {
			http.Error(w, "Invalid token format", http.StatusUnauthorized)
			return
		}

		// Extract the token from the header
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
			return secretKey, nil
		})

		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		if _, ok := token.Claims.(*Claims); ok && token.Valid {
			// Token is valid, proceed to the next handler.
			next.ServeHTTP(w, r)
		} else {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
		}
	})
}
