package db

import (
	"fmt"

	"github.com/spf13/viper"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

var Instance *gorm.DB

func Connect() {
	db, err := gorm.Open(postgres.Open(fmt.Sprintf(
		"host=%s port=%d user=%s dbname=%s password=%s sslmode=disable TimeZone=%s",
		viper.GetString("DB_HOST"),
		viper.GetInt("DB_PORT"),
		viper.GetString("DB_USER"),
		viper.GetString("DB_NAME"),
		viper.GetString("DB_PASSWORD"),
		viper.GetString("DB_TIMEZONE"),
	)), &gorm.Config{
		PrepareStmt:            true,
		SkipDefaultTransaction: true,
		NamingStrategy: schema.NamingStrategy{
			TablePrefix: "fin_",
		},
	})
	if err != nil {
		panic(err.Error())
	}
	db.AutoMigrate(
		&Admin{},
		&User{},
		&WorkspaceMember{},
		&Workspace{},
		&AccountType{},
		&Currency{},
		&Account{},
		&Category{},
		&Place{},
		&Transaction{},
	)
	Instance = db
}
