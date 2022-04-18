package utils

import "time"

func GetDaysOfMonth(now time.Time) (time.Time, time.Time) {
	currentYear, currentMonth, _ := now.Date()
	firstOfMonth := time.Date(currentYear, currentMonth, 1, 0, 0, 0, 0, now.Location())
	lastOfMonth := firstOfMonth.AddDate(0, 1, -1)
	return firstOfMonth, lastOfMonth
}
