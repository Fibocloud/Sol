package controllers

import (
	"net/http"

	"github.com/Fibocloud/Sol/backend/middlewares"
	"github.com/Fibocloud/Sol/backend/ostack"
	"github.com/Fibocloud/Sol/backend/structs"
	"github.com/gin-gonic/gin"
)

type FlavorController struct {
	Controller
}

func (co FlavorController) Register(router *gin.RouterGroup) {
	private := router.Group("").Use(middlewares.Auth())
	private.GET("list", co.List)
	private.GET("get/:id", co.Get)
	private.POST("create", co.Create)
	private.DELETE("delete/:id", co.Delete)
}

// Flavors
// @Summary   Flavor
// @Tags      Flavor
// @Security  Authorization
// @Success   200  {object}  structs.ResponseBody{body=[]interface{}}
// @Failure   400  {object}  structs.ResponseBody{body=object}
// @Failure   401  {object}  structs.ResponseBody{body=object}
// @Failure   500  {object}  structs.ResponseBody{body=object}
// @Router    /flavor/list [post]
func (co FlavorController) List(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	auth := middlewares.GetAuth(c)
	flavors, err := ostack.Connect(auth.OSCredential).Flavor().List()
	if err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}
	co.SetBody(flavors)
}

// Get flavor
// @Summary   Get flavor with ID
// @Tags      Flavor
// @Security  Authorization
// @Param     id   path      int  true  "Flavor ID"
// @Success   200  {object}  structs.ResponseBody{body=interface{}}
// @Failure   401  {object}  structs.ResponseBody{body=object}
// @Failure   500  {object}  structs.ResponseBody{body=object}
// @Router    /flavor/get/{id} [get]
func (co FlavorController) Get(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	ID := c.Param("id")
	auth := middlewares.GetAuth(c)
	flavor, err := ostack.Connect(auth.OSCredential).Flavor().Get(ID)
	if err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}
	co.SetBody(flavor)
}

// Create flavor
// @Summary   Create flavor with image
// @Tags      Flavor
// @Security  Authorization
// @Param     input  body      ostack.FlavorCreateInput  true  "Input"
// @Success   200  {object}  structs.ResponseBody{body=structs.SuccessResponse}
// @Failure   400  {object}  structs.ResponseBody{body=object}
// @Failure   401  {object}  structs.ResponseBody{body=object}
// @Failure   500  {object}  structs.ResponseBody{body=object}
// @Router    /flavor/create [post]
func (co FlavorController) Create(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	var params ostack.FlavorCreateInput
	if err := c.ShouldBindJSON(&params); err != nil {
		co.SetError(http.StatusBadRequest, err.Error())
		return
	}

	auth := middlewares.GetAuth(c)
	flavor, err := ostack.Connect(auth.OSCredential).Flavor().Create(params)
	if err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}
	co.SetBody(flavor)
}

// Delete flavor
// @Summary   Delete flavor
// @Tags      Flavor
// @Security  Authorization
// @Param     id   path      int  true  "Flavor ID"
// @Success   200    {object}  structs.ResponseBody{body=structs.SuccessResponse}
// @Failure   400    {object}  structs.ResponseBody{body=object}
// @Failure   401    {object}  structs.ResponseBody{body=object}
// @Failure   500    {object}  structs.ResponseBody{body=object}
// @Router    /flavor/delete/{id} [delete]
func (co FlavorController) Delete(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	ID := c.Param("id")
	auth := middlewares.GetAuth(c)
	if err := ostack.Connect(auth.OSCredential).Flavor().Delete(ID); err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}

	co.SetBody(structs.SuccessResponse{Success: true})
}
