package controllers

import (
	"net/http"

	"github.com/Fibocloud/Sol/backend/middlewares"
	"github.com/Fibocloud/Sol/backend/ostack"
	"github.com/Fibocloud/Sol/backend/structs"
	"github.com/gin-gonic/gin"
)

type InstanceController struct {
	Controller
}

func (co InstanceController) Register(router *gin.RouterGroup) {
	private := router.Group("").Use(middlewares.Auth())
	private.GET("list", co.List)
	private.GET("get/:id", co.Get)
	private.POST("create", co.Create)
	private.PUT("update/:id", co.Update)
	private.DELETE("delete/:id", co.Delete)
	private.PUT("reboot/:id", co.Reboot)
	private.PUT("resize/:id/:flavor_id", co.Resize)
	private.PUT("confirm-resize/:id", co.ConfirmResize)
	private.PUT("revert-resize/:id", co.RevertResize)
	private.PUT("start/:id", co.Start)
	private.PUT("stop/:id", co.Stop)
	private.PUT("resume/:id", co.Resume)
	private.PUT("suspend/:id", co.Suspend)
}

// Instances
// @Summary   Instance
// @Tags      Instance
// @Security  Authorization
// @Success   200  {object}  structs.ResponseBody{body=[]interface{}}
// @Failure   400  {object}  structs.ResponseBody{body=object}
// @Failure   401  {object}  structs.ResponseBody{body=object}
// @Failure   500  {object}  structs.ResponseBody{body=object}
// @Router    /instance/list [post]
func (co InstanceController) List(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	auth := middlewares.GetAuth(c)
	instances, err := ostack.Connect(auth.OSCredential).Instance().List()
	if err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}
	co.SetBody(instances)
}

// Get instance
// @Summary   Get instance with ID
// @Tags      Instance
// @Security  Authorization
// @Param     id   path      int  true  "Instance ID"
// @Success   200  {object}  structs.ResponseBody{body=interface{}}
// @Failure   401   {object}  structs.ResponseBody{body=object}
// @Failure   500   {object}  structs.ResponseBody{body=object}
// @Router    /instance/get/{id} [get]
func (co InstanceController) Get(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	ID := c.Param("id")
	auth := middlewares.GetAuth(c)
	instance, err := ostack.Connect(auth.OSCredential).Instance().Get(ID)
	if err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}
	co.SetBody(instance)
}

// Create instance
// @Summary   Create instance with image
// @Tags      Instance
// @Security  Authorization
// @Param     input  body      ostack.InstanceCreateInput  true  "Input"
// @Success   200  {object}  structs.ResponseBody{body=structs.SuccessResponse}
// @Failure   400  {object}  structs.ResponseBody{body=object}
// @Failure   401  {object}  structs.ResponseBody{body=object}
// @Failure   500  {object}  structs.ResponseBody{body=object}
// @Router    /instance/create [post]
func (co InstanceController) Create(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	var params ostack.InstanceCreateInput
	if err := c.ShouldBindJSON(&params); err != nil {
		co.SetError(http.StatusBadRequest, err.Error())
		return
	}

	auth := middlewares.GetAuth(c)
	instance, err := ostack.Connect(auth.OSCredential).Instance().Create(params)
	if err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}
	co.SetBody(instance)
}

// Update instance
// @Summary   Update instance
// @Tags      Instance
// @Security  Authorization
// @Param     id     path      int                         true  "Instance ID"
// @Param     input  body      ostack.InstanceUpdateInput  true  "Input"
// @Success   200  {object}  structs.ResponseBody{body=structs.SuccessResponse}
// @Failure   400   {object}  structs.ResponseBody{body=object}
// @Failure   401        {object}  structs.ResponseBody{body=object}
// @Failure   500        {object}  structs.ResponseBody{body=object}
// @Router    /instance/update/{id} [put]
func (co InstanceController) Update(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	var params ostack.InstanceUpdateInput
	if err := c.ShouldBindJSON(&params); err != nil {
		co.SetError(http.StatusBadRequest, err.Error())
		return
	}

	ID := c.Param("id")
	auth := middlewares.GetAuth(c)
	_, err := ostack.Connect(auth.OSCredential).Instance().Update(ID, params)
	if err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}

	co.SetBody(structs.SuccessResponse{Success: true})
}

// Delete instance
// @Summary   Delete instance
// @Tags      Instance
// @Security  Authorization
// @Param     id         path      int   true  "Instance ID"
// @Success   200        {object}  structs.ResponseBody{body=structs.SuccessResponse}
// @Failure   400        {object}  structs.ResponseBody{body=object}
// @Failure   401  {object}  structs.ResponseBody{body=object}
// @Failure   500  {object}  structs.ResponseBody{body=object}
// @Router    /instance/delete/{id} [delete]
func (co InstanceController) Delete(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	ID := c.Param("id")
	auth := middlewares.GetAuth(c)
	if err := ostack.Connect(auth.OSCredential).Instance().Delete(ID); err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}

	co.SetBody(structs.SuccessResponse{Success: true})
}

// Reboot instance
// @Summary   Reboot instance
// @Tags      Instance
// @Security  Authorization
// @Param     id   path      int  true  "Instance ID"
// @Param     hard  query     bool  true  "Hard restart"
// @Success   200   {object}  structs.ResponseBody{body=structs.SuccessResponse}
// @Failure   400  {object}  structs.ResponseBody{body=object}
// @Failure   401  {object}  structs.ResponseBody{body=object}
// @Failure   500  {object}  structs.ResponseBody{body=object}
// @Router    /instance/reboot/{id} [put]
func (co InstanceController) Reboot(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	ID := c.Param("id")
	auth := middlewares.GetAuth(c)
	hard := c.DefaultQuery("hard", "false") == "true"
	if err := ostack.Connect(auth.OSCredential).Instance().Reboot(ID, hard); err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}

	co.SetBody(structs.SuccessResponse{Success: true})
}

// Resize instance
// @Summary   Resize instance
// @Tags      Instance
// @Security  Authorization
// @Param     id   path      int  true  "Instance ID"
// @Param     flavor_id  path      bool  true  "Flavor ID"
// @Success   200  {object}  structs.ResponseBody{body=structs.SuccessResponse}
// @Failure   400  {object}  structs.ResponseBody{body=object}
// @Failure   401  {object}  structs.ResponseBody{body=object}
// @Failure   500  {object}  structs.ResponseBody{body=object}
// @Router    /instance/resize/{id}/{flavor_id} [put]
func (co InstanceController) Resize(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	ID := c.Param("id")
	auth := middlewares.GetAuth(c)
	FLAVOR_ID := c.Param("flavor_id")
	if err := ostack.Connect(auth.OSCredential).Instance().Resize(ID, FLAVOR_ID); err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}

	co.SetBody(structs.SuccessResponse{Success: true})
}

// Confirm resize instance
// @Summary   Confirm resize instance
// @Tags      Instance
// @Security  Authorization
// @Param     id   path      int  true  "Instance ID"
// @Success   200  {object}  structs.ResponseBody{body=structs.SuccessResponse}
// @Failure   400  {object}  structs.ResponseBody{body=object}
// @Failure   401  {object}  structs.ResponseBody{body=object}
// @Failure   500  {object}  structs.ResponseBody{body=object}
// @Router    /instance/confirm-resize/{id} [put]
func (co InstanceController) ConfirmResize(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	ID := c.Param("id")
	auth := middlewares.GetAuth(c)
	if err := ostack.Connect(auth.OSCredential).Instance().ConfirmResize(ID); err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}

	co.SetBody(structs.SuccessResponse{Success: true})
}

// Revert resize instance
// @Summary   Revert resize instance
// @Tags      Instance
// @Security  Authorization
// @Param     id   path      int  true  "Instance ID"
// @Success   200  {object}  structs.ResponseBody{body=structs.SuccessResponse}
// @Failure   400  {object}  structs.ResponseBody{body=object}
// @Failure   401  {object}  structs.ResponseBody{body=object}
// @Failure   500  {object}  structs.ResponseBody{body=object}
// @Router    /instance/revert-resize/{id} [put]
func (co InstanceController) RevertResize(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	ID := c.Param("id")
	auth := middlewares.GetAuth(c)
	if err := ostack.Connect(auth.OSCredential).Instance().RevertResize(ID); err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}

	co.SetBody(structs.SuccessResponse{Success: true})
}

// Start instance
// @Summary   Start instance
// @Tags      Instance
// @Security  Authorization
// @Param     id   path      int  true  "Instance ID"
// @Success   200  {object}  structs.ResponseBody{body=structs.SuccessResponse}
// @Failure   400  {object}  structs.ResponseBody{body=object}
// @Failure   401  {object}  structs.ResponseBody{body=object}
// @Failure   500  {object}  structs.ResponseBody{body=object}
// @Router    /instance/start/{id} [put]
func (co InstanceController) Start(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	ID := c.Param("id")
	auth := middlewares.GetAuth(c)
	if err := ostack.Connect(auth.OSCredential).Instance().Start(ID); err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}

	co.SetBody(structs.SuccessResponse{Success: true})
}

// Stop instance
// @Summary   Stop instance
// @Tags      Instance
// @Security  Authorization
// @Param     id   path      int  true  "Instance ID"
// @Success   200  {object}  structs.ResponseBody{body=structs.SuccessResponse}
// @Failure   400  {object}  structs.ResponseBody{body=object}
// @Failure   401  {object}  structs.ResponseBody{body=object}
// @Failure   500  {object}  structs.ResponseBody{body=object}
// @Router    /instance/stop/{id} [put]
func (co InstanceController) Stop(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	ID := c.Param("id")
	auth := middlewares.GetAuth(c)
	if err := ostack.Connect(auth.OSCredential).Instance().Stop(ID); err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}

	co.SetBody(structs.SuccessResponse{Success: true})
}

// Resume instance
// @Summary   Resume instance
// @Tags      Instance
// @Security  Authorization
// @Param     id   path      int  true  "Instance ID"
// @Success   200    {object}  structs.ResponseBody{body=structs.SuccessResponse}
// @Failure   400    {object}  structs.ResponseBody{body=object}
// @Failure   401    {object}  structs.ResponseBody{body=object}
// @Failure   500    {object}  structs.ResponseBody{body=object}
// @Router    /instance/resume/{id} [put]
func (co InstanceController) Resume(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	ID := c.Param("id")
	auth := middlewares.GetAuth(c)
	if err := ostack.Connect(auth.OSCredential).Instance().Resume(ID); err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}

	co.SetBody(structs.SuccessResponse{Success: true})
}

// Suspend instance
// @Summary   Suspend instance
// @Tags      Instance
// @Security  Authorization
// @Param     id    path      int   true  "Instance ID"
// @Success   200    {object}  structs.ResponseBody{body=structs.SuccessResponse}
// @Failure   400    {object}  structs.ResponseBody{body=object}
// @Failure   401    {object}  structs.ResponseBody{body=object}
// @Failure   500    {object}  structs.ResponseBody{body=object}
// @Router    /instance/suspend/{id} [put]
func (co InstanceController) Suspend(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	ID := c.Param("id")
	auth := middlewares.GetAuth(c)
	if err := ostack.Connect(auth.OSCredential).Instance().Suspend(ID); err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}

	co.SetBody(structs.SuccessResponse{Success: true})
}
