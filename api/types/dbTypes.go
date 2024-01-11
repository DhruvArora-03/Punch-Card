package types

import "time"

type ShiftHistoryResult struct {
	ClockIn    time.Time
	ClockOut   time.Time
	UserNotes  string
	AdminNotes string
}
