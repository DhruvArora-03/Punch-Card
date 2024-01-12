package types

import "time"

type ShiftHistoryResult struct {
	ClockIn    time.Time
	ClockOut   time.Time
	UserNotes  string
	AdminNotes string
}

// type ShiftHistoryResult struct {
// 	ClockIn    time.Time `json:"clock_in_time"`
// 	ClockOut   time.Time `json:"clock_out_time"`
// 	UserNotes  string    `json:"user_notes"`
// 	AdminNotes string    `json:"admin_notes"`
// }
