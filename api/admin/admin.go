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
	var userIDParam uint64

	// get params
	vars := mux.Vars(r)

	userIDParam, err = strconv.ParseUint(vars["userID"], 10, 64)
	if err != nil {
		http.Error(w, "Invalid URL month param", http.StatusBadRequest)
	}

	// the expected request body
	var request types.User

	// check if body matches
	err = json.NewDecoder(r.Body).Decode(&request)
	if err != nil && err.Error() != "EOF" {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// check that param matches request body
	if request.UserID != userIDParam {
		http.Error(w, "Invalid request parameter - ensure user_id matches", http.StatusBadRequest)
		return
	}

	var userID uint64
	userID, err = auth.ExtractUserID(r)
	if err != nil {
		http.Error(w, "ExtractUserID failed despite successful ValidateToken", http.StatusInternalServerError)
		return
	}

	db.UpdateUser(request, userID)

	w.Header().Set("Content-Type", "text/plain")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Saved!"))
}
