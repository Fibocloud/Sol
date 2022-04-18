package utils

import (
	"math"
	"strconv"
	"time"
)

// Int32Pointer ...
func Int32Pointer(i int32) *int32 {
	return &i
}

// Ptr2Str is Pointer to String if nil return ""
func Ptr2Str(value *string) string {
	if value != nil {
		return *value
	}
	return ""
}

// Ptr2Int is Pointer to Int if nil return -1
func Ptr2Int(value *int) int {
	if value != nil {
		return *value
	}
	return -1
}

// Ptr2Float is Pointer to Float if nil return -1
func Ptr2Float(value *float64) float64 {
	if value != nil {
		return *value
	}
	return -1
}

// Str2Unix is String to Unix
func Str2Unix(value string) time.Time {
	i, err := strconv.ParseInt(value, 10, 64)
	if err != nil {
		panic(err)
	}
	return time.Unix(i, 0)
}

// Str2Uint is String to Uint
func Str2Uint(value string) uint {
	i, err := strconv.ParseUint(value, 10, 64)
	if err != nil {
		panic(err)
	}
	return uint(i)
}

// Str2Duration is String to Duration
func Str2Duration(value string) time.Duration {
	i, err := strconv.ParseInt(value, 10, 64)
	if err != nil {
		panic(err)
	}
	return time.Duration(i) * time.Second
}

// UInt2Str is UInt to String if nil return ""
func UInt2Str(value uint) string {
	return strconv.FormatUint(uint64(value), 10)
}

// Str2Ptr is Pointer to String if nil return ""
func Str2Ptr(value string) *string {
	return &value
}

// StrToFloat64 is string to float64
func StrToFloat64(input *string) float64 {
	if input == nil {
		return 0
	}
	value, err := strconv.ParseFloat(*input, 64)
	if err != nil {
		return 0
	}
	return value
}

// RoundUp is float64 round up
func RoundUp(val float64, precision int) float64 {
	return math.Ceil(val*(math.Pow10(precision))) / math.Pow10(precision)
}

// StrToTime is string to time.Time
func StrToTime(input *string) time.Time {
	if input == nil {
		return time.Time{}
	}
	value, err := time.Parse("2006-01-02", *input)
	if err != nil {
		return time.Time{}
	}
	return value
}
