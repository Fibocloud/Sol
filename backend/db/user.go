package db

import (
	"time"
)

type (
	Base struct {
		ID        uint      `gorm:"primarykey" json:"id" faker:"-"`
		CreatedAt time.Time `gorm:"column:created_at;not null" json:"created_at" faker:"-"`
		UpdatedAt time.Time `gorm:"column:updated_at;not null" json:"updated_at" faker:"-"`
	}

	Meta struct {
		CreatorID uint  `gorm:"column:creator_id;not null" json:"creator_id"`
		Creator   *User `gorm:"foreignKey:CreatorID" json:"creator,omitempty"`
		UpdaterID uint  `gorm:"column:updater_id;not null" json:"updater_id"`
		Updater   *User `gorm:"foreignKey:UpdaterID" json:"updater,omitempty"`
	}

	OSCredential struct {
		Username string `gorm:"column:username;not null" json:"username"`
		Password string `gorm:"column:password;not null" json:"password"`
		TenantID string `gorm:"column:tenant_id;not null" json:"tenant_id"`
	}

	User struct {
		Base
		Username      string       `gorm:"column:username;size:64;unique;not null" json:"username"`
		Password      string       `gorm:"column:password;size:128;not null" json:"-"`
		Enable        bool         `gorm:"column:enable;default:true" json:"enable"`
		OSCredential  OSCredential `gorm:"embedded;embeddedPrefix:os_credential_" json:"os_credentail,omitempty"`
		LastLoginDate time.Time    `gorm:"column:last_login_date;not null" json:"last_login_date"`
	}
)
