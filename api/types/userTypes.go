package types

type User struct {
	UserID                 uint64 `json:"user_id"`
	Username               string `json:"username"`
	FirstName              string `json:"first_name"`
	LastName               string `json:"last_name"`
	HourlyPayCents         uint16 `json:"hourly_pay_cents"`
	Role                   string `json:"role"`
	PreferredPaymentMethod string `json:"preferred_payment_method"`
}

type Login struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token     string `json:"token"`
	Role      string `json:"role"`
	FirstName string `json:"first_name"`
}
