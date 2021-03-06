package controllers

import (
	"net/http"
	"strings"

	"github.com/Fibocloud/Sol/backend/db"
	"github.com/Fibocloud/Sol/backend/middlewares"
	"github.com/Fibocloud/Sol/backend/utils"
	"github.com/gin-gonic/gin"
)

type AuthController struct {
	Controller
}

func (co AuthController) Register(router *gin.RouterGroup) {
	router.GET("init", co.Init)
	router.POST("login", co.Login)

	private := router.Group("").Use(middlewares.Auth())
	private.GET("info", co.Info)
}

// Init
// @Summary  Init
// @Tags     Auth
// @Success  200  {object}  string
// @Failure  401  {object}  string
// @Failure  500  {object}  string
// @Router   /auth/init [get]
func (co AuthController) Init(c *gin.Context) {
	hashPwd, err := utils.GenerateHash("Mongol123")
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	user := db.User{
		Username: "admin",
		Password: hashPwd,
		OSCredential: db.OSCredential{
			Username: "admin",
			Password: "Mongol123",
			TenantID: "a21f9221672d4cf880005b38c1ab458c",
		},
	}

	if Total(db.Instance.Model(db.User{}).Where(&db.User{Username: user.Username})) > 0 {
		c.JSON(http.StatusOK, "OK")
		return
	}

	if err := db.Instance.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, "OK")
}

type (
	LoginInput struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	LoginResult struct {
		Token string  `json:"token"`
		User  db.User `json:"user"`
	}
)

// Login
// @Summary  Login
// @Tags     Auth
// @Param    input  body      LoginInput  true  "Input"
// @Success  200    {object}  structs.ResponseBody{body=LoginResult}
// @Failure  400    {object}  structs.ResponseBody{body=object}
// @Failure  401    {object}  structs.ResponseBody{body=object}
// @Failure  500    {object}  structs.ResponseBody{body=object}
// @Router   /auth/login [post]
func (co AuthController) Login(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	var params LoginInput
	if err := c.ShouldBindJSON(&params); err != nil {
		co.SetError(http.StatusNotFound, err.Error())
		return
	}

	var user db.User
	if err := db.Instance.Where(db.User{Username: strings.TrimSpace(params.Username)}).First(&user).Error; err != nil {
		co.SetError(http.StatusNotFound, "???????????????????????? ?????? ?????????? ???????? ???? ?????????? ??????????")
		return
	}

	if err := utils.ComparePassword(user.Password, params.Password); err != nil {
		co.SetError(http.StatusNotFound, "???????????????????????? ?????? ?????????? ???????? ???? ?????????? ??????????")
		return
	}

	co.SetBody(LoginResult{
		Token: utils.GenerateToken(utils.Claims{ID: user.ID}),
		User:  user,
	})
}

// Info
// @Summary   Info
// @Tags      Auth
// @Security  Authorization
// @Success   200  {object}  structs.ResponseBody{body=db.User}
// @Failure   400  {object}  structs.ResponseBody{body=object}
// @Failure   401  {object}  structs.ResponseBody{body=object}
// @Failure   500  {object}  structs.ResponseBody{body=object}
// @Router    /auth/info [get]
func (co AuthController) Info(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()
	co.SetBody(middlewares.GetAuth(c))
}
