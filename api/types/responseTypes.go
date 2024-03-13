package types

import "time"

type LoginResponse struct {
	Token     string `json:"token"`
	Role      string `json:"role"`
	FirstName string `json:"first_name"`
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
