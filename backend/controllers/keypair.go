package controllers

import (
	"net/http"

	"github.com/Fibocloud/Sol/backend/middlewares"
	"github.com/Fibocloud/Sol/backend/ostack"
	"github.com/Fibocloud/Sol/backend/structs"
	"github.com/gin-gonic/gin"
)

type KeypairController struct {
	Controller
}

func (co KeypairController) Register(router *gin.RouterGroup) {
	private := router.Group("").Use(middlewares.Auth())
	private.GET("list", co.List)
	private.GET("get/:id", co.Get)
	private.POST("create", co.Create)
	private.DELETE("delete/:id", co.Delete)
}

// Keypairs
// @Summary   Keypair list with pagination
// @Tags      Keypair
// @Security  Authorization
// @Success   200  {object}  structs.ResponseBody{body=[]interface{}}
// @Failure   400  {object}  structs.ResponseBody{body=object}
// @Failure   401  {object}  structs.ResponseBody{body=object}
// @Failure   500  {object}  structs.ResponseBody{body=object}
// @Router    /keypair/list [post]
func (co KeypairController) List(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	auth := middlewares.GetAuth(c)
	keypairs, err := ostack.Connect(auth.OSCredential).Keypair().List()
	if err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}
	co.SetBody(keypairs)
}

// Get keypair
// @Summary   Get keypair with ID
// @Tags      Keypair
// @Security  Authorization
// @Param     id   path      int  true  "Keypair ID"
// @Success   200  {object}  structs.ResponseBody{body=interface{}}
// @Failure   401  {object}  structs.ResponseBody{body=object}
// @Failure   500  {object}  structs.ResponseBody{body=object}
// @Router    /keypair/get/{id} [get]
func (co KeypairController) Get(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	ID := c.Param("id")
	auth := middlewares.GetAuth(c)
	keypair, err := ostack.Connect(auth.OSCredential).Keypair().Get(ID)
	if err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}
	co.SetBody(keypair)
}

// Create keypair
// @Summary   Create keypair with image
// @Tags      Keypair
// @Security  Authorization
// @Param     input  body      ostack.KeypairCreateInput  true  "Input"
// @Success   200  {object}  structs.ResponseBody{body=structs.SuccessResponse}
// @Failure   400  {object}  structs.ResponseBody{body=object}
// @Failure   401  {object}  structs.ResponseBody{body=object}
// @Failure   500  {object}  structs.ResponseBody{body=object}
// @Router    /keypair/create [post]
func (co KeypairController) Create(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	var params ostack.KeypairCreateInput
	if err := c.ShouldBindJSON(&params); err != nil {
		co.SetError(http.StatusBadRequest, err.Error())
		return
	}

	auth := middlewares.GetAuth(c)
	keypair, err := ostack.Connect(auth.OSCredential).Keypair().Create(params)
	if err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}
	co.SetBody(keypair)
}

// Delete keypair
// @Summary   Delete keypair
// @Tags      Keypair
// @Security  Authorization
// @Param     id   path      int  true  "Keypair ID"
// @Success   200    {object}  structs.ResponseBody{body=structs.SuccessResponse}
// @Failure   400    {object}  structs.ResponseBody{body=object}
// @Failure   401    {object}  structs.ResponseBody{body=object}
// @Failure   500    {object}  structs.ResponseBody{body=object}
// @Router    /keypair/delete/{id} [delete]
func (co KeypairController) Delete(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	ID := c.Param("id")
	auth := middlewares.GetAuth(c)
	if err := ostack.Connect(auth.OSCredential).Keypair().Delete(ID); err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}

	co.SetBody(structs.SuccessResponse{Success: true})
}
