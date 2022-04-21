package controllers

import (
	"net/http"

	"github.com/Fibocloud/Sol/backend/middlewares"
	"github.com/Fibocloud/Sol/backend/ostack"
	"github.com/Fibocloud/Sol/backend/structs"
	"github.com/gin-gonic/gin"
)

type ImageController struct {
	Controller
}

func (co ImageController) Register(router *gin.RouterGroup) {
	private := router.Group("").Use(middlewares.Auth())
	private.GET("list", co.List)
	private.GET("get/:id", co.Get)
	private.DELETE("delete/:id", co.Delete)
}

// Images
// @Summary   Image list with pagination
// @Tags      Image
// @Security  Authorization
// @Success   200  {object}  structs.ResponseBody{body=[]interface{}}
// @Failure   400  {object}  structs.ResponseBody{body=object}
// @Failure   401  {object}  structs.ResponseBody{body=object}
// @Failure   500  {object}  structs.ResponseBody{body=object}
// @Router    /image/list [post]
func (co ImageController) List(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	auth := middlewares.GetAuth(c)
	images, err := ostack.Connect(auth.OSCredential).Image().List()
	if err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}
	co.SetBody(images)
}

// Get image
// @Summary   Get image with ID
// @Tags      Image
// @Security  Authorization
// @Param     id   path      int  true  "Image ID"
// @Success   200  {object}  structs.ResponseBody{body=interface{}}
// @Failure   401  {object}  structs.ResponseBody{body=object}
// @Failure   500  {object}  structs.ResponseBody{body=object}
// @Router    /image/get/{id} [get]
func (co ImageController) Get(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	ID := c.Param("id")
	auth := middlewares.GetAuth(c)
	image, err := ostack.Connect(auth.OSCredential).Image().Get(ID)
	if err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}
	co.SetBody(image)
}

// Delete image
// @Summary   Delete image
// @Tags      Image
// @Security  Authorization
// @Param     id   path      int  true  "Image ID"
// @Success   200    {object}  structs.ResponseBody{body=structs.SuccessResponse}
// @Failure   400    {object}  structs.ResponseBody{body=object}
// @Failure   401    {object}  structs.ResponseBody{body=object}
// @Failure   500    {object}  structs.ResponseBody{body=object}
// @Router    /image/delete/{id} [delete]
func (co ImageController) Delete(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	ID := c.Param("id")
	auth := middlewares.GetAuth(c)
	if err := ostack.Connect(auth.OSCredential).Image().Delete(ID); err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}

	co.SetBody(structs.SuccessResponse{Success: true})
}
