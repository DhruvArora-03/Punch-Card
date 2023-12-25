package shifts

import (
	"fmt"
	"encoding/json"
	"net/http"
	"punchcard-api/auth"
	"punchcard-api/db"
	"time"
)

func ClockInHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println(time.Now())
	fmt.Printf("%s ~/clock-in\n\n", r.Method)
	time.Sleep(2 * time.Second)
	
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// the expected request body
	var request struct {
		Time time.Time `json:time`
	}
	
	// check if body matches
	err := json.NewDecoder(r.Body).Decode(&request);
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	
	var userID string
	userID, err = auth.ExtractUserID(r)
	if err != nil {
		http.Error(w, "ExtractUserID failed despite successful ValidateToken", http.StatusInternalServerError)
		return
	}

	err = db.ClockIn(userID, request.Time)
	if err != nil {
		http.Error(w, "Clock in request failed, try again later", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/plain")
	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("Successfully clocked in"))
}