package types

import "time"

type ShiftHistoryResult struct {
	ClockIn    time.Time
	ClockOut   time.Time
	UserNotes  string
	AdminNotes string
}

type UserDataResult struct {
	UserID                 uint64
	Username               string
	FirstName              string
	LastName               string
	HourlyPay              float32
	Role                   string
	PreferredPaymentMethod string
}
