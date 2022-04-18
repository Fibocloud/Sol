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

	Admin struct {
		Base
		Username string `gorm:"column:username;size:64;unique;not null" json:"username"`
		Password string `gorm:"column:password;size:128;not null" json:"-"`
	}

	User struct {
		Base
		Avatar        *string           `gorm:"column:avatar" json:"avatar,omitempty"`
		Email         string            `gorm:"column:email;size:256;unique;not null" json:"email"`
		Firstname     string            `gorm:"column:firstname;size:256;not null" json:"firstname"`
		Lastname      string            `gorm:"column:lastname;size:256;not null" json:"lastname"`
		Password      string            `gorm:"column:password;size:256;not null" json:"-"`
		Enable        bool              `gorm:"column:enable;default:true" json:"enable"`
		LastLoginDate time.Time         `gorm:"column:last_login_date;not null" json:"last_login_date"`
		ResetCode     *string           `gorm:"column:reset_code;size:8" json:"-"`
		Workspaces    []WorkspaceMember `gorm:"foreignKey:UserID" json:"workspaces,omitempty"`
		Accounts      []Account         `gorm:"foreignKey:OwnerID" json:"accounts,omitempty"`
	}

	WorkspaceRole string

	WorkspaceMember struct {
		ID          uint          `gorm:"primarykey" json:"id" faker:"-"`
		UserID      uint          `gorm:"column:user_id;not null" json:"user_id"`
		User        *User         `gorm:"foreignKey:UserID" json:"user,omitempty"`
		WorkspaceID uint          `gorm:"column:workspace_id;not null" json:"workspace_id"`
		Workspace   *Workspace    `gorm:"foreignKey:WorkspaceID" json:"workspace,omitempty"`
		Role        WorkspaceRole `gorm:"column:role;not null" json:"role"`
	}

	Workspace struct {
		Base
		OwnerID      uint              `gorm:"column:owner_id;not null" json:"owner_id"`
		Owner        *User             `gorm:"foreignKey:OwnerID" json:"owner,omitempty"`
		Name         string            `gorm:"column:name;size:256;not null" json:"name"`
		Avatar       *string           `gorm:"column:avatar" json:"avatar,omitempty"`
		Description  *string           `gorm:"column:description" json:"description,omitempty"`
		InviteCode   *string           `gorm:"column:invite_code;unique;size:5" json:"invite_code,omitempty"`
		Members      []WorkspaceMember `gorm:"foreignKey:WorkspaceID" json:"members,omitempty"`
		AccountTypes []AccountType     `gorm:"foreignKey:WorkspaceID" json:"account_types,omitempty"`
		Currencies   []Currency        `gorm:"foreignKey:WorkspaceID" json:"currencies,omitempty"`
		Accounts     []Account         `gorm:"foreignKey:WorkspaceID" json:"accounts,omitempty"`
		Categories   []Category        `gorm:"foreignKey:WorkspaceID" json:"categories,omitempty"`
		Places       []Place           `gorm:"foreignKey:WorkspaceID" json:"places,omitempty"`
		Transactions []Transaction     `gorm:"foreignKey:WorkspaceID" json:"transactions,omitempty"`
	}

	AccountType struct {
		Base
		Meta        Meta       `gorm:"embedded" json:"meta,omitempty"`
		WorkspaceID uint       `gorm:"column:workspace_id;not null" json:"workspace_id"`
		Workspace   *Workspace `gorm:"foreignKey:WorkspaceID" json:"workspace,omitempty"`
		Name        string     `gorm:"column:name;size:256;not null" json:"name"`
		Avatar      *string    `gorm:"column:avatar" json:"avatar,omitempty"`
		Accounts    []Account  `gorm:"foreignKey:TypeID" json:"accounts,omitempty"`
	}

	Currency struct {
		Base
		Meta        Meta       `gorm:"embedded" json:"meta,omitempty"`
		WorkspaceID uint       `gorm:"column:workspace_id;not null" json:"workspace_id"`
		Workspace   *Workspace `gorm:"foreignKey:WorkspaceID" json:"workspace,omitempty"`
		Name        string     `gorm:"column:name;size:256;not null" json:"name"`
		Short       string     `gorm:"column:short;size:6;not null" json:"short"`
		Symbol      string     `gorm:"column:symbol;size:6;not null" json:"symbol"`
		Accounts    []Account  `gorm:"foreignKey:CurrencyID" json:"accounts,omitempty"`
	}

	Account struct {
		Base
		OwnerID        uint          `gorm:"column:owner_id;not null" json:"owner_id"`
		Owner          *User         `gorm:"foreignKey:OwnerID" json:"owner,omitempty"`
		WorkspaceID    uint          `gorm:"column:workspace_id;not null" json:"workspace_id"`
		Workspace      *Workspace    `gorm:"foreignKey:WorkspaceID" json:"workspace,omitempty"`
		TypeID         uint          `gorm:"column:type_id;not null" json:"type_id"`
		Type           *AccountType  `gorm:"foreignKey:TypeID" json:"type,omitempty"`
		CurrencyID     uint          `gorm:"column:currency_id;not null" json:"currency_id"`
		Currency       *Currency     `gorm:"foreignKey:CurrencyID" json:"currency,omitempty"`
		Name           string        `gorm:"column:name;size:256;not null" json:"name"`
		Avatar         *string       `gorm:"column:avatar" json:"avatar,omitempty"`
		Enable         bool          `gorm:"column:enable;default:true" json:"enable"`
		Balance        float64       `gorm:"column:balance;default:0" json:"balance"`
		InitialBalance float64       `gorm:"column:initial_balance;default:0" json:"initial_balance"`
		ExpenseBalance float64       `gorm:"column:expense_balance;default:0" json:"expense_balance"`
		IncomeBalance  float64       `gorm:"column:income_balance;default:0" json:"income_balance"`
		Transactions   []Transaction `gorm:"foreignKey:AccountID" json:"transactions,omitempty"`
	}

	TransactionType string

	Category struct {
		Base
		Meta         Meta            `gorm:"embedded" json:"meta,omitempty"`
		WorkspaceID  uint            `gorm:"column:workspace_id;not null" json:"workspace_id"`
		Workspace    *Workspace      `gorm:"foreignKey:WorkspaceID" json:"workspace,omitempty"`
		Name         string          `gorm:"column:name;size:256;not null" json:"name"`
		Avatar       *string         `gorm:"column:avatar" json:"avatar,omitempty"`
		Type         TransactionType `gorm:"column:type;not null" json:"type"`
		IsFee        bool            `gorm:"column:is_fee;default:false" json:"is_fee"`
		Transactions []Transaction   `gorm:"foreignKey:CategoryID" json:"transactions,omitempty"`
	}

	Place struct {
		Base
		Meta         Meta          `gorm:"embedded" json:"meta,omitempty"`
		WorkspaceID  uint          `gorm:"column:workspace_id;not null" json:"workspace_id"`
		Workspace    *Workspace    `gorm:"foreignKey:WorkspaceID" json:"workspace,omitempty"`
		Name         string        `gorm:"column:name;size:256;not null" json:"name"`
		Avatar       *string       `gorm:"column:avatar" json:"avatar,omitempty"`
		Location     *string       `gorm:"column:location" json:"location,omitempty"`
		Description  *string       `gorm:"column:description" json:"description,omitempty"`
		Transactions []Transaction `gorm:"foreignKey:PlaceID" json:"transactions,omitempty"`
	}

	Transaction struct {
		Base
		Meta        Meta            `gorm:"embedded" json:"meta,omitempty"`
		WorkspaceID uint            `gorm:"column:workspace_id;not null" json:"workspace_id"`
		Workspace   *Workspace      `gorm:"foreignKey:WorkspaceID" json:"workspace,omitempty"`
		AccountID   uint            `gorm:"column:account_id;not null" json:"account_id"`
		Account     *Account        `gorm:"foreignKey:AccountID" json:"account,omitempty"`
		CategoryID  uint            `gorm:"column:category_id;not null" json:"category_id"`
		Category    *Category       `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
		Type        TransactionType `gorm:"column:type;not null" json:"type"`
		Amount      float64         `gorm:"column:amount;not null" json:"amount"`
		Description string          `gorm:"column:description;size:256;not null" json:"description"`
		Date        time.Time       `gorm:"column:date;not null" json:"date"`
		PlaceID     *uint           `gorm:"column:place_id" json:"place_id,omitempty"`
		Place       *Place          `gorm:"foreignKey:PlaceID" json:"place,omitempty"`
	}
)

const (
	WorkspaceRoleOwner  WorkspaceRole = "OWNER"
	WorkspaceRoleAdmin  WorkspaceRole = "ADMIN"
	WorkspaceRoleMember WorkspaceRole = "MEMBER"

	TransactionTypeExpense  TransactionType = "EXPENSE"
	TransactionTypeIncome   TransactionType = "INCOME"
	TransactionTypeTransfer TransactionType = "TRANSFER"
)
