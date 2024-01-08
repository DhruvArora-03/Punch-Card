package shifts

import (
	"encoding/json"
	"fmt"
	"net/http"
	"punchcard-api/auth"
	"punchcard-api/db"
	"time"
)

type statusResponseType struct {
	Name string `json:"name"`
	IsClockedIn bool   `json:"is_clocked_in"`
	ClockInTime time.Time `json:"clock_in_time"`
	Notes string `json:"notes"`
}

type clockResponseType struct {
	IsClockedIn bool   `json:"is_clocked_in"`
	ClockInTime time.Time `json:"clock_in_time"`
}

func GetStatusHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println(time.Now())
	fmt.Printf("%s ~/status\n\n", r.Method)
	time.Sleep(2 * time.Second)
	
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID, err := auth.ExtractUserID(r)
	if err != nil {
		http.Error(w, "Extraction failed unexpectedly", http.StatusInternalServerError)
		return
	}

	isClockedIn, clockInTime, notes, err :=  db.GetClockInStatus(userID)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Couldn't retrieve current user status", http.StatusInternalServerError)
		return
	}

	firstName, err := db.GetFirstName(userID)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Couldn't retrieve current user data", http.StatusInternalServerError)
		return
	}

	// Respond with a JSON object
	response := statusResponseType{
		Name: firstName,
		IsClockedIn: isClockedIn,
		ClockInTime: clockInTime,
		Notes: notes,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

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
		Time time.Time `json:"time"`
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

	// Respond with a JSON object
	response := clockResponseType{
		IsClockedIn: true,
		ClockInTime: request.Time,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func ClockOutHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println(time.Now())
	fmt.Printf("%s ~/clock-out\n\n", r.Method)
	time.Sleep(2 * time.Second)

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// the expected request body
	var request struct {
		Time time.Time `json:"time"`
		Notes string `json:"notes"`
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

	err = db.ClockOut(userID, request.Time, request.Notes)
	if err != nil {
		http.Error(w, "Clock out request failed, try again later", http.StatusInternalServerError)
		return
	}

	// Respond with a JSON object
	response := clockResponseType{
		IsClockedIn: false,
		ClockInTime: time.Time{},
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func SaveNotesHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println(time.Now())
	fmt.Printf("%s ~/clock-notes\n\n", r.Method)
	time.Sleep(2 * time.Second)

	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// the expected request body
	var request struct {
		Notes string `json:"notes"`
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

	err = db.UpdateNotes(userID, request.Notes)
	if err != nil {
		http.Error(w, "Update notes request failed, try again later", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/plain")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Saved!"))
}

