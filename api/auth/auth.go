package auth

import (
	"crypto/rand"
	"encoding/hex"
	"net/http"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

var SecretKey = []byte("change-this-to-an-actual-secret-key-later-because-this-is-not-very-secure-like-this-or-something-like-that-but-tbh-there's-no-way-that-anyone-ever-guesses-this-so-maybe-it-is-fine")

// Claims represents the structure of JWT claims.
type Claims struct {
	UserID string
	jwt.StandardClaims
}

// generate salt of 16 random bytes
func GenerateSalt() ([]byte, error) {
	salt := make([]byte, 16)
	_, err := rand.Read(salt) // Read random data from the crypto/rand package
	return salt, err
}

// input: password
// output: hash, err, saltUsed
func HashPassword(password string, salt []byte) (string, error) {
	// password is a hex string so turn into bytes
	decodedPassword, err := hex.DecodeString(password)
	if err != nil {
		return "", err
	}

	// now add salt and hash
	combined := append(decodedPassword, salt...)
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(combined), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}

	// convert to strings and return
	return string(hashedPassword), nil
}

// input: actual, unhashed attempt, salt
// output: true/false if they are same
func CheckPassword(actualHash string, password string, salt string) (bool, error) {
	decoded, err := hex.DecodeString(password + salt)
	if err != nil {
		return false, err
	}

	return bcrypt.CompareHashAndPassword([]byte(actualHash), decoded) == nil, nil
}

// ValidateToken is a middleware function to validate JWT tokens.
func ValidateToken(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		
		// Check if the header exists
		if authHeader == "" {
			http.Error(w, "Authorization not found", http.StatusUnauthorized)
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
			return SecretKey, nil
		})

		if err != nil {
			http.Error(w, "Could not parse authorization token", http.StatusUnauthorized)
			return
		}

		// check that the token matches format
		_, ok := token.Claims.(*Claims);
		if  ok && token.Valid {
			// Token is valid, proceed to the next handler.
			next.ServeHTTP(w, r)
		} else {
			http.Error(w, "Invalid authorization token", http.StatusUnauthorized)
		}
	})
}