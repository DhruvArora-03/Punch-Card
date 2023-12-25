package shifts

import (
	"net/http"
	"punchcard-api/auth"
	"punchcard-api/db"
)

func ClockInHandler(w http.ResponseWriter, r *http.Request) {
	userID, err := auth.ExtractUserID(r)
	if err != nil {
		http.Error(w, "ExtractUserID failed despite successful ValidateToken", http.StatusInternalServerError)
	}

	db.ClockIn(userID)
	
}