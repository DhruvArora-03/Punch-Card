package types

import "time"

type Shift struct {
	ClockIn    time.Time
	ClockOut   time.Time
	UserNotes  string
	AdminNotes string
}

type User struct {
	UserID                 uint64 `json:"user_id"`
	Username               string `json:"username"`
	FirstName              string `json:"first_name"`
	LastName               string `json:"last_name"`
	HourlyPayCents         uint16 `json:"hourly_pay_cents"`
	Role                   string `json:"role"`
	PreferredPaymentMethod string `json:"preferred_payment_method"`
}
