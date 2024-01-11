package types

import "time"

type StatusResponseType struct {
	Name        string    `json:"name"`
	IsClockedIn bool      `json:"is_clocked_in"`
	ClockInTime time.Time `json:"clock_in_time"`
	Notes       string    `json:"notes"`
}

type ClockResponseType struct {
	IsClockedIn bool      `json:"is_clocked_in"`
	ClockInTime time.Time `json:"clock_in_time"`
}