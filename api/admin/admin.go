package admin

import (
	"encoding/json"
	"fmt"
	"net/http"
	"punchcard-api/auth"
	"punchcard-api/db"
	"punchcard-api/types"
	"strings"
	"time"
)

func GetAllUsersHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println(time.Now())
	fmt.Printf("%s ~/users\n\n", r.Method)
	
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// the expected request body
	var request types.EmptyRequestType

	// check if body matches
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil && err.Error() != "EOF" {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	var userID uint64
	userID, err = auth.ExtractUserID(r)
	if err != nil {
		http.Error(w, "ExtractUserID failed despite successful ValidateToken", http.StatusInternalServerError)
		return
	}

	// check perms - tutor cannot view
	var userRole string
	userRole, err = db.GetUserRole(userID)
	if err != nil {
		http.Error(w, "GetUserRole failed, internal issue", http.StatusInternalServerError)
	}
	if strings.ToLower(userRole) == "employee" {
		http.Error(w, "Employees are not allowed to access this resource", http.StatusUnauthorized)
	}

	var response []types.UserDataResult
	response, _ = db.GetAllUsers(userID)

	// Respond with a JSON object
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
