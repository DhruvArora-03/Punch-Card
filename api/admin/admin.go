package admin

import (
	"encoding/json"
	"fmt"
	"net/http"
	"punchcard-api/auth"
	"punchcard-api/db"
	"punchcard-api/types"
	"strconv"
	"time"

	"github.com/gorilla/mux"
)

func CreateUserHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println(time.Now())
	fmt.Printf("%s ~/users\n\n", r.Method)

	// the expected request body
	var request types.UserWithoutID

	// check if body matches
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil && err.Error() != "EOF" {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	var user types.NewUser
	user.Username = request.Username
	user.FirstName = request.FirstName
	user.LastName = request.LastName
	user.HourlyPayCents = request.HourlyPayCents
	user.Role = request.Role
	user.PreferredPaymentMethod = request.PreferredPaymentMethod

	user.Salt, err = auth.GenerateSalt()
	if err != nil {
		http.Error(w, "Internal Error, could not generate a valid salt - "+err.Error(), http.StatusInternalServerError)
		return
	}

	// default password is "password"
	user.HashedPassword, err = auth.HashPassword("password", user.Salt)
	if err != nil {
		http.Error(w, "Internal error, could not hash password - "+err.Error(), http.StatusInternalServerError)
		return
	}

	var requesterID uint64
	requesterID, err = auth.ExtractUserID(r)
	if err != nil {
		http.Error(w, "ExtractUserID failed despite successful ValidateToken", http.StatusInternalServerError)
		return
	}

	db.CreateUser(user, requesterID)

	w.Header().Set("Content-Type", "text/plain")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Created!"))
}

func GetAllUsersHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println(time.Now())
	fmt.Printf("%s ~/users\n\n", r.Method)

	// the expected request body
	var request types.Empty

	// check if body matches
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil && err.Error() != "EOF" {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	var response []types.User
	response, _ = db.GetAllUsers()

	// Respond with a JSON object
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func GetUserHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println(time.Now())
	fmt.Printf("%s ~/user\n\n", r.Method)

	var err error
	var userIDParam uint64

	// get params
	vars := mux.Vars(r)

	userIDParam, err = strconv.ParseUint(vars["userID"], 10, 64)
	if err != nil {
		http.Error(w, "Invalid URL param", http.StatusBadRequest)
	}

	// the expected request body
	var request types.Empty

	// check if body matches
	err = json.NewDecoder(r.Body).Decode(&request)
	if err != nil && err.Error() != "EOF" {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	var response types.User
	response, _ = db.GetUser(userIDParam)

	// Respond with a JSON object
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func UpdateUserHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println(time.Now())
	fmt.Printf("%s ~/user\n\n", r.Method)

	var err error
	var userID uint64

	// get params
	vars := mux.Vars(r)

	userID, err = strconv.ParseUint(vars["userID"], 10, 64)
	if err != nil {
		http.Error(w, "Invalid URL month param", http.StatusBadRequest)
	}

	// the expected request body
	var request types.UserWithoutID

	// check if body matches
	err = json.NewDecoder(r.Body).Decode(&request)
	if err != nil && err.Error() != "EOF" {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	var requesterID uint64
	requesterID, err = auth.ExtractUserID(r)
	if err != nil {
		http.Error(w, "ExtractUserID failed despite successful ValidateToken", http.StatusInternalServerError)
		return
	}

	db.UpdateUser(userID, request, requesterID)

	w.Header().Set("Content-Type", "text/plain")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Saved!"))
}
