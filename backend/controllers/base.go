package controllers

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/Fibocloud/Sol/backend/structs"
	"github.com/Fibocloud/Sol/backend/utils"
	"gorm.io/gorm"
)

type Controller struct {
	Response *structs.Response
}

func (co Controller) SetBody(body interface{}) {
	co.Response.StatusCode = http.StatusOK
	co.Response.Body.Message = ""
	co.Response.Body.Body = body
}

func (co Controller) SetError(code int, message string) {
	co.Response.StatusCode = code
	co.Response.Body.Message = message
	co.Response.Body.Body = nil
}

func (co Controller) GetBody() (int, interface{}) {
	return co.Response.StatusCode, co.Response.Body
}

func Paginate(input *structs.PaginationInput) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		tmpLimit := 20
		tmpOffset := 0
		if input != nil {
			tmpLimit = input.Limit
			tmpOffset = input.Page * input.Limit
			db = Sort(input.Sorter)(db)
		}
		return db.Offset(tmpOffset).Limit(tmpLimit)
	}
}

func Sort(input structs.Sorter) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		for key, val := range input {
			order := "ASC"
			if strings.HasPrefix(strings.ToLower(val), "desc") {
				order = "DESC"
			}
			db = db.Order(fmt.Sprintf("%s %s", key, order))
		}
		return db
	}
}

func Cursor(input structs.CursorInput) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		return db.Where("id > ?", input.PreviousID).Order("id DESC").Limit(input.Limit)
	}
}

func Total(db *gorm.DB) int {
	var total int64
	db.Count(&total)
	return int(total)
}

func Like(db *gorm.DB, field string, value *string) *gorm.DB {
	if utils.IsNil(value) {
		return db
	}
	return db.Where(fmt.Sprintf("LOWER(%s) like LOWER(?)", field), "%"+*value+"%")
}

func OrLike(db *gorm.DB, field string, value *string) *gorm.DB {
	if utils.IsNil(value) {
		return db
	}
	return db.Or(fmt.Sprintf("LOWER(%s) like LOWER(?)", field), "%"+*value+"%")
}

func Equal(db *gorm.DB, field string, value interface{}) *gorm.DB {
	if utils.IsNil(value) {
		return db
	}
	return db.Where(fmt.Sprintf("%s = ?", field), value)
}

func Include(db *gorm.DB, field string, values []interface{}) *gorm.DB {
	if utils.IsNil(values) {
		return db
	}
	return db.Where(fmt.Sprintf("%s IN ?", field), values)
}

func OrEqual(db *gorm.DB, field string, value interface{}) *gorm.DB {
	if utils.IsNil(value) {
		return db
	}
	return db.Or(fmt.Sprintf("%s = ?", field), value)
}

func EqualGreater(db *gorm.DB, field string, value interface{}) *gorm.DB {
	if utils.IsNil(value) {
		return db
	}
	return db.Where(fmt.Sprintf("%s >= ?", field), value)
}

func OrEqualGreater(db *gorm.DB, field string, value interface{}) *gorm.DB {
	if utils.IsNil(value) {
		return db
	}
	return db.Or(fmt.Sprintf("%s >= ?", field), value)
}

func EqualLower(db *gorm.DB, field string, value interface{}) *gorm.DB {
	if utils.IsNil(value) {
		return db
	}
	return db.Where(fmt.Sprintf("%s <= ?", field), value)
}

func OrEqualLower(db *gorm.DB, field string, value interface{}) *gorm.DB {
	if utils.IsNil(value) {
		return db
	}
	return db.Or(fmt.Sprintf("%s <= ?", field), value)
}

func DateEqual(db *gorm.DB, field string, value interface{}) *gorm.DB {
	if utils.IsNil(value) {
		return db
	}
	return db.Where(fmt.Sprintf("DATE(%s) = DATE(?)", field), value)
}

func OrDateEqual(db *gorm.DB, field string, value interface{}) *gorm.DB {
	if utils.IsNil(value) {
		return db
	}
	return db.Or(fmt.Sprintf("DATE(%s) = DATE(?)", field), value)
}

func Between(db *gorm.DB, field string, min interface{}, max interface{}) *gorm.DB {
	if utils.IsNil(min) || utils.IsNil(max) {
		return db
	}
	return db.Where(fmt.Sprintf("%s >= ? AND %s <= ?", field, field), min, max)
}

func OrBetween(db *gorm.DB, field string, min interface{}, max interface{}) *gorm.DB {
	if utils.IsNil(min) || utils.IsNil(max) {
		return db
	}
	return db.Or(fmt.Sprintf("%s >= ? AND %s <= ?", field, field), min, max)
}
