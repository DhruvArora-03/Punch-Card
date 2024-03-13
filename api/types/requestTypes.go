package types

import "time"

type Empty struct {
}

type Login struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

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
