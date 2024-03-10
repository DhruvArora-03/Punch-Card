package shifts

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

func GetStatusHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println(time.Now())
	fmt.Printf("%s ~/status\n\n", r.Method)

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID, err := auth.ExtractUserID(r)
	if err != nil {
		http.Error(w, "Extraction failed unexpectedly", http.StatusInternalServerError)
		return
	}

	isClockedIn, clockInTime, notes, err := db.GetClockInStatus(userID)
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Couldn't retrieve current user status", http.StatusInternalServerError)
		return
	}

	// Respond with a JSON object
	response := types.StatusResponseType{
		IsClockedIn: isClockedIn,
		ClockInTime: clockInTime,
		Notes:       notes,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func ClockInHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println(time.Now())
	fmt.Printf("%s ~/clock-in\n\n", r.Method)

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// the expected request body
	var request types.ClockInRequestType

	// check if body matches
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	var userID uint64
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
	response := types.ClockResponseType{
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

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// the expected request body
	var request types.ClockOutRequestType

	// check if body matches
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	var userID uint64
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
	response := types.ClockResponseType{
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

	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// the expected request body
	var request types.SaveNotesRequestType

	// check if body matches
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	var userID uint64
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

func GetShiftHistoryHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println(time.Now())
	fmt.Printf("%s ~/shift-history\n\n", r.Method)

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var err error
	var month, year int

	// get params
	vars := mux.Vars(r)

	month, err = strconv.Atoi(vars["month"])
	if err != nil {
		http.Error(w, "Invalid URL month param", http.StatusBadRequest)
	}

	year, err = strconv.Atoi(vars["year"])
	if err != nil {
		http.Error(w, "Invalid URL year param", http.StatusBadRequest)
	}

	// the expected request body
	var request types.EmptyRequestType

	// check if body matches
	err = json.NewDecoder(r.Body).Decode(&request)
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

	var response []types.ShiftHistoryResult
	response, _ = db.GetShiftHistory(userID, month, year)

	// Respond with a JSON object
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
