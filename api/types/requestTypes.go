package types

import "time"

type LoginRequestType struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type ClockInRequestType struct {
	Time time.Time `json:"time"`
}

type ClockOutRequestType struct {
	Time  time.Time `json:"time"`
	Notes string    `json:"notes"`
}

type SaveNotesRequestType struct {
	Notes string `json:"notes"`
}

type ShiftHistoryRequestType struct {

}
