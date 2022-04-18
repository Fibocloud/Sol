package controllers

import (
	"net/http"

	"github.com/Fibocloud/Sol/backend/db"
	"github.com/Fibocloud/Sol/backend/middlewares"
	"github.com/Fibocloud/Sol/backend/structs"
	"github.com/Fibocloud/Sol/backend/utils"
	"github.com/gin-gonic/gin"
)

type UserController struct {
	Controller
}

func (co UserController) Register(router *gin.RouterGroup) {
	private := router.Group("").Use(middlewares.Auth())
	private.POST("list", co.List)
	private.GET("search", co.Search)
	private.GET("get/:id", co.Get)
	private.DELETE("delete/:id", co.Delete)
	private.PUT("password/:id", co.Password)
	private.PUT("status/:id", co.Status)
}

type UserListInput struct {
	structs.PaginationInput
	Firstname *string `json:"firstname"`
	Lastname  *string `json:"lastname"`
	Email     *string `json:"email"`
	Enable    *bool   `json:"enable"`
}

// Users
// @Summary   User list with pagination
// @Tags      User
// @Security  Authorization
// @Param     filter  body      UserListInput  false  "Filter"
// @Success   200     {object}  structs.ResponseBody{body=structs.PaginationResponse{items=[]db.User}}
// @Failure   400     {object}  structs.ResponseBody{body=object}
// @Failure   401     {object}  structs.ResponseBody{body=object}
// @Failure   500     {object}  structs.ResponseBody{body=object}
// @Router    /user/list [post]
func (co UserController) List(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	var params UserListInput
	if err := c.ShouldBindJSON(&params); err != nil {
		co.SetError(http.StatusBadRequest, err.Error())
		return
	}

	orm := db.Instance.Model(&db.User{})
	orm = Like(orm, "firstname", params.Firstname)
	orm = Like(orm, "lastname", params.Lastname)
	orm = Like(orm, "email", params.Email)
	orm = Equal(orm, "enable", params.Enable)
	result := structs.PaginationResponse{Total: Total(orm)}
	var items []db.User
	if err := orm.Scopes(Paginate(&params.PaginationInput)).Find(&items).Error; err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}
	result.Items = items
	co.SetBody(result)
}

type UserSearchInput struct {
	structs.CursorInput
	Query string `form:"query" json:"query"`
}

// Users search
// @Summary   User search with cursor pagination
// @Tags      User
// @Security  Authorization
// @Param     filter  query     UserSearchInput  false  "Filter"
// @Success   200     {object}  structs.ResponseBody{body=structs.CursorResponse{items=[]db.User}}
// @Failure   400     {object}  structs.ResponseBody{body=object}
// @Failure   401     {object}  structs.ResponseBody{body=object}
// @Failure   500     {object}  structs.ResponseBody{body=object}
// @Router    /user/search [get]
func (co UserController) Search(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	params := UserSearchInput{CursorInput: structs.CursorInput{Limit: 20, PreviousID: 0}}
	if err := c.ShouldBindQuery(&params); err != nil {
		co.SetError(http.StatusBadRequest, err.Error())
		return
	}
	orm := db.Instance.Model(&db.User{})
	orm = Like(orm, "firstname", &params.Query)
	orm = Like(orm, "lastname", &params.Query)
	orm = Like(orm, "email", &params.Query)
	result := structs.CursorResponse{HasNext: true}
	var items []db.User
	if err := orm.Scopes(Cursor(params.CursorInput)).Find(&items).Error; err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}
	if len(items) < params.Limit {
		result.HasNext = false
	}
	result.Items = items
	co.SetBody(result)
}

// Get user
// @Summary   Get user with ID
// @Tags      User
// @Security  Authorization
// @Param     id   path      int  true  "User ID"
// @Success   200  {object}  structs.ResponseBody{body=db.User}
// @Failure   401  {object}  structs.ResponseBody{body=object}
// @Failure   500  {object}  structs.ResponseBody{body=object}
// @Router    /user/get/{id} [get]
func (co UserController) Get(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	ID := c.Param("id")
	var instance db.User
	if err := db.Instance.Preload("Workspaces").Preload("Accounts").First(&instance, ID).Error; err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}

	co.SetBody(instance)
}

// Delete user
// @Summary   Delete user
// @Tags      User
// @Security  Authorization
// @Param     id   path      int  true  "User ID"
// @Success   200  {object}  structs.ResponseBody{body=structs.SuccessResponse}
// @Failure   400  {object}  structs.ResponseBody{body=object}
// @Failure   401  {object}  structs.ResponseBody{body=object}
// @Failure   500  {object}  structs.ResponseBody{body=object}
// @Router    /user/delete/{id} [delete]
func (co UserController) Delete(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	ID := c.Param("id")
	deleteModal := db.User{Base: db.Base{ID: utils.Str2Uint(ID)}}
	if err := db.Instance.
		Select(
			"Accounts",
			"Workspaces",
		).
		Delete(&deleteModal).Error; err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}

	co.SetBody(structs.SuccessResponse{Success: true})
}

type UserPasswordInput struct {
	Password string `json:"password" binding:"required"`
}

// Password
// @Summary   Password change
// @Tags      User
// @Security  Authorization
// @Param     id     path      int                true  "User ID"
// @Param     input  body      UserPasswordInput  true  "Input"
// @Success   200    {object}  structs.ResponseBody{body=structs.SuccessResponse}
// @Failure   400    {object}  structs.ResponseBody{body=object}
// @Failure   401    {object}  structs.ResponseBody{body=object}
// @Failure   500    {object}  structs.ResponseBody{body=object}
// @Router    /user/password/{id} [put]
func (co UserController) Password(c *gin.Context) {
	tx := db.Instance.Begin()
	defer func() {
		if rec := recover(); rec != nil {
			tx.Rollback()
		}
		c.JSON(co.GetBody())
	}()

	var params UserPasswordInput
	if err := c.ShouldBindJSON(&params); err != nil {
		co.SetError(http.StatusBadRequest, err.Error())
		return
	}

	ID := c.Param("id")
	oldUser := db.User{Base: db.Base{ID: utils.Str2Uint(ID)}}
	hashPwd, err := utils.GenerateHash(params.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	if err := db.Instance.Model(&oldUser).Updates(map[string]interface{}{
		"password": hashPwd,
	}).Error; err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}

	co.SetBody(structs.SuccessResponse{Success: true})
}

type UserStatusInput struct {
	Enable bool `json:"enable"`
}

// Status
// @Summary   Status change
// @Tags      User
// @Security  Authorization
// @Param     id     path      int              true  "User ID"
// @Param     input  body      UserStatusInput  true  "Input"
// @Success   200    {object}  structs.ResponseBody{body=structs.SuccessResponse}
// @Failure   400    {object}  structs.ResponseBody{body=object}
// @Failure   401    {object}  structs.ResponseBody{body=object}
// @Failure   500    {object}  structs.ResponseBody{body=object}
// @Router    /user/status/{id} [put]
func (co UserController) Status(c *gin.Context) {
	tx := db.Instance.Begin()
	defer func() {
		if rec := recover(); rec != nil {
			tx.Rollback()
		}
		c.JSON(co.GetBody())
	}()

	var params UserStatusInput
	if err := c.ShouldBindJSON(&params); err != nil {
		co.SetError(http.StatusBadRequest, err.Error())
		return
	}

	ID := c.Param("id")
	oldUser := db.User{Base: db.Base{ID: utils.Str2Uint(ID)}}
	if err := db.Instance.Model(&oldUser).Updates(map[string]interface{}{
		"enable": params.Enable,
	}).Error; err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}

	co.SetBody(structs.SuccessResponse{Success: true})
}
