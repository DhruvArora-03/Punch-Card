package auth

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

var secretKey = []byte("change-this-to-an-actual-secret-key-later-because-this-is-not-very-secure-like-this-or-something-like-that-but-tbh-there's-no-way-that-anyone-ever-guesses-this-so-maybe-it-is-fine")

// Claims represents the structure of JWT claims.
type claims struct {
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

// input: userID
// output: tokenString
func GenerateJWT(userID string) (string, error) {
	expirationTime := time.Now().Add(5 * time.Minute)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &claims{
		UserID: userID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	})

	return token.SignedString(secretKey)
}

func extractToken(r *http.Request) (*jwt.Token, error) {
	authHeader := r.Header.Get("Authorization")

	// Check if the header exists
	if authHeader == "" {
		return nil, errors.New("Authorization not found")
	}

	// Check if the header has the "Bearer " prefix
	if !strings.HasPrefix(authHeader, "Bearer ") {
		return nil, errors.New("Invalid token format")
	}

	// Extract the token from the header
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	token, err := jwt.ParseWithClaims(tokenString, &claims{}, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})
	if err != nil {
		return nil, errors.New("Could not parse authorization token")
	}

	return token, nil
}

func ExtractUserID(r *http.Request) (string, error) {
	token, err := extractToken(r)
	if err != nil {
		return "", err
	}

	// Check that the token matches the expected format
	claims, ok := token.Claims.(*claims)
	if ok && token.Valid {
		// Return the user ID from the claims
		return claims.UserID, nil
	}

	return "", errors.New("Invalid authorization token")
}


// ValidateToken is a middleware function to validate JWT tokens.
func ValidateToken(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token, err := extractToken(r)
		if err != nil {
			http.Error(w, err.Error(), http.StatusUnauthorized)
			return
		}


		// check that the token matches format
		_, ok := token.Claims.(*claims);
		if ok && token.Valid {
			// Token is valid, proceed to the next handler.
			next.ServeHTTP(w, r)
		} else {
			http.Error(w, "Invalid authorization token", http.StatusUnauthorized)
		}
	})
}