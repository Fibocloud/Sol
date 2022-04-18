package controllers

import (
	"net/http"

	"github.com/Fibocloud/Sol/backend/db"
	"github.com/Fibocloud/Sol/backend/middlewares"
	"github.com/Fibocloud/Sol/backend/structs"
	"github.com/gin-gonic/gin"
)

type InstanceController struct {
	Controller
}

func (co InstanceController) Register(router *gin.RouterGroup) {
	private := router.Group("").Use(middlewares.Auth())
	private.POST("list", co.List)
	private.GET("get/:id", co.Get)
	// private.POST("create", co.Create)
	// private.PUT("resize/:id", co.Resize)
	// private.PUT("start/:id", co.Start)
	// private.PUT("stop/:id", co.Stop)
	// private.PUT("resume/:id", co.Resume)
	// private.PUT("suspend/:id", co.Suspend)
	// private.DELETE("delete/:id", co.Delete)
}

type InstanceListInput struct {
	structs.PaginationInput
	Firstname *string `json:"firstname"`
	Lastname  *string `json:"lastname"`
	Email     *string `json:"email"`
	Enable    *bool   `json:"enable"`
}

// Instances
// @Summary   Instance list with pagination
// @Tags      Instance
// @Security  Authorization
// @Param     filter  body      InstanceListInput  false  "Filter"
// @Success   200     {object}  structs.ResponseBody{body=structs.PaginationResponse{items=[]db.Instance}}
// @Failure   400     {object}  structs.ResponseBody{body=object}
// @Failure   401     {object}  structs.ResponseBody{body=object}
// @Failure   500     {object}  structs.ResponseBody{body=object}
// @Router    /instance/list [post]
func (co InstanceController) List(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	var params InstanceListInput
	if err := c.ShouldBindJSON(&params); err != nil {
		co.SetError(http.StatusBadRequest, err.Error())
		return
	}

	// ostack.Connect("", "", "").Instance().Create()
}

type InstanceSearchInput struct {
	structs.CursorInput
	Query string `form:"query" json:"query"`
}

// Get instance
// @Summary   Get instance with ID
// @Tags      Instance
// @Security  Authorization
// @Param     id   path      int  true  "Instance ID"
// @Success   200  {object}  structs.ResponseBody{body=db.Instance}
// @Failure   401  {object}  structs.ResponseBody{body=object}
// @Failure   500  {object}  structs.ResponseBody{body=object}
// @Router    /instance/get/{id} [get]
func (co InstanceController) Get(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	ID := c.Param("id")
	var instance interface{}
	if err := db.Instance.Preload("Workspaces").Preload("Accounts").First(&instance, ID).Error; err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}

	co.SetBody(instance)
}
