package types

import "time"

type ClockIn struct {
	Time time.Time `json:"time"`
}

type ClockOut struct {
	Time  time.Time `json:"time"`
	Notes string    `json:"notes"`
}

type Notes struct {
	Notes string `json:"notes"`
}

type Shift struct {
	ClockIn    time.Time
	ClockOut   time.Time
	UserNotes  string
	AdminNotes string
}

type Status struct {
	IsClockedIn bool      `json:"is_clocked_in"`
	ClockInTime time.Time `json:"clock_in_time"`
	Notes       string    `json:"notes"`
}

type ClockResponse struct {
	IsClockedIn bool      `json:"is_clocked_in"`
	ClockInTime time.Time `json:"clock_in_time"`
}
