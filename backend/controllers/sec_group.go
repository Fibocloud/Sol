package controllers

import (
	"net/http"

	"github.com/Fibocloud/Sol/backend/middlewares"
	"github.com/Fibocloud/Sol/backend/ostack"
	"github.com/Fibocloud/Sol/backend/structs"
	"github.com/gin-gonic/gin"
)

type SecGroupController struct {
	Controller
}

func (co SecGroupController) Register(router *gin.RouterGroup) {
	private := router.Group("").Use(middlewares.Auth())
	private.GET("list", co.List)
	private.GET("get/:id", co.Get)
	private.POST("create", co.Create)
	private.PUT("update/:id", co.Update)
	private.DELETE("delete/:id", co.Delete)
	private.POST("add_server/:instance_id/:id", co.AddServer)
	private.DELETE("remove_server/:instance_id/:id", co.RemoveServer)
	private.POST("create_rule", co.CreateRule)
	private.DELETE("delete_rule/:id", co.DeleteRule)
}

// Security groups
// @Summary   Security group
// @Tags      SecGroup
// @Security  Authorization
// @Success   200  {object}  structs.ResponseBody{body=[]interface{}}
// @Failure   400          {object}  structs.ResponseBody{body=object}
// @Failure   401          {object}  structs.ResponseBody{body=object}
// @Failure   500          {object}  structs.ResponseBody{body=object}
// @Router    /sec_group/list [post]
func (co SecGroupController) List(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	auth := middlewares.GetAuth(c)
	secGroups, err := ostack.Connect(auth.OSCredential).SecGroup().List()
	if err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}
	co.SetBody(secGroups)
}

// Get security group
// @Summary   Get security group with ID
// @Tags      SecGroup
// @Security  Authorization
// @Param     id   path      int  true  "Security group ID"
// @Success   200  {object}  structs.ResponseBody{body=interface{}}
// @Failure   401  {object}  structs.ResponseBody{body=object}
// @Failure   500  {object}  structs.ResponseBody{body=object}
// @Router    /sec_group/get/{id} [get]
func (co SecGroupController) Get(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	ID := c.Param("id")
	auth := middlewares.GetAuth(c)
	secGroup, err := ostack.Connect(auth.OSCredential).SecGroup().Get(ID)
	if err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}
	co.SetBody(secGroup)
}

// Create security group
// @Summary   Create security group
// @Tags      SecGroup
// @Security  Authorization
// @Param     input  body      ostack.SecGroupCreateInput  true  "Input"
// @Success   200          {object}  structs.ResponseBody{body=structs.SuccessResponse}
// @Failure   400  {object}  structs.ResponseBody{body=object}
// @Failure   401          {object}  structs.ResponseBody{body=object}
// @Failure   500          {object}  structs.ResponseBody{body=object}
// @Router    /sec_group/create [post]
func (co SecGroupController) Create(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	var params ostack.SecGroupCreateInput
	if err := c.ShouldBindJSON(&params); err != nil {
		co.SetError(http.StatusBadRequest, err.Error())
		return
	}

	auth := middlewares.GetAuth(c)
	secGroup, err := ostack.Connect(auth.OSCredential).SecGroup().Create(params)
	if err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}
	co.SetBody(secGroup)
}

// Update security group
// @Summary   Update security group
// @Tags      SecGroup
// @Security  Authorization
// @Param     id     path      int                         true  "Security group ID"
// @Param     input  body      ostack.SecGroupUpdateInput  true  "Input"
// @Success   200  {object}  structs.ResponseBody{body=structs.SuccessResponse}
// @Failure   400          {object}  structs.ResponseBody{body=object}
// @Failure   401  {object}  structs.ResponseBody{body=object}
// @Failure   500  {object}  structs.ResponseBody{body=object}
// @Router    /sec_group/update/{id} [put]
func (co SecGroupController) Update(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	var params ostack.SecGroupUpdateInput
	if err := c.ShouldBindJSON(&params); err != nil {
		co.SetError(http.StatusBadRequest, err.Error())
		return
	}

	ID := c.Param("id")
	auth := middlewares.GetAuth(c)
	_, err := ostack.Connect(auth.OSCredential).SecGroup().Update(ID, params)
	if err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}

	co.SetBody(structs.SuccessResponse{Success: true})
}

// Delete security group
// @Summary   Delete security group
// @Tags      SecGroup
// @Security  Authorization
// @Param     id   path      int  true  "Security group ID"
// @Success   200          {object}  structs.ResponseBody{body=structs.SuccessResponse}
// @Failure   400  {object}  structs.ResponseBody{body=object}
// @Failure   401  {object}  structs.ResponseBody{body=object}
// @Failure   500  {object}  structs.ResponseBody{body=object}
// @Router    /sec_group/delete/{id} [delete]
func (co SecGroupController) Delete(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	ID := c.Param("id")
	auth := middlewares.GetAuth(c)
	if err := ostack.Connect(auth.OSCredential).SecGroup().Delete(ID); err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}

	co.SetBody(structs.SuccessResponse{Success: true})
}

// Add server security group
// @Summary   Add server security group
// @Tags      SecGroup
// @Security  Authorization
// @Param     id           path      string  true  "Security group ID"
// @Param     instance_id  path      string  true  "Instance ID"
// @Success   200  {object}  structs.ResponseBody{body=structs.SuccessResponse}
// @Failure   400  {object}  structs.ResponseBody{body=object}
// @Failure   401  {object}  structs.ResponseBody{body=object}
// @Failure   500  {object}  structs.ResponseBody{body=object}
// @Router    /sec_group/add_server/{instance_id}/{id} [post]
func (co SecGroupController) AddServer(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	ID := c.Param("id")
	INSTANCE_ID := c.Param("instance_id")
	auth := middlewares.GetAuth(c)
	if err := ostack.Connect(auth.OSCredential).SecGroup().AddServer(INSTANCE_ID, ID); err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}

	co.SetBody(structs.SuccessResponse{Success: true})
}

// Remove server security group
// @Summary   Remove server security group
// @Tags      SecGroup
// @Security  Authorization
// @Param     id           path      string  true  "Security group ID"
// @Param     instance_id  path      string  true  "Instance ID"
// @Success   200    {object}  structs.ResponseBody{body=structs.SuccessResponse}
// @Failure   400    {object}  structs.ResponseBody{body=object}
// @Failure   401    {object}  structs.ResponseBody{body=object}
// @Failure   500    {object}  structs.ResponseBody{body=object}
// @Router    /sec_group/remove_server/{instance_id}/{id} [delete]
func (co SecGroupController) RemoveServer(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	ID := c.Param("id")
	INSTANCE_ID := c.Param("instance_id")
	auth := middlewares.GetAuth(c)
	if err := ostack.Connect(auth.OSCredential).SecGroup().RemoveServer(INSTANCE_ID, ID); err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}

	co.SetBody(structs.SuccessResponse{Success: true})
}

// Add server security group
// @Summary   Add server security group
// @Tags      SecGroup
// @Security  Authorization
// @Param     input  body      ostack.SecGroupCreateRuleInput  true  "Input"
// @Success   200    {object}  structs.ResponseBody{body=structs.SuccessResponse}
// @Failure   400    {object}  structs.ResponseBody{body=object}
// @Failure   401    {object}  structs.ResponseBody{body=object}
// @Failure   500    {object}  structs.ResponseBody{body=object}
// @Router    /sec_group/create_rule [post]
func (co SecGroupController) CreateRule(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	var params ostack.SecGroupCreateRuleInput
	if err := c.ShouldBindJSON(&params); err != nil {
		co.SetError(http.StatusBadRequest, err.Error())
		return
	}

	auth := middlewares.GetAuth(c)
	_, err := ostack.Connect(auth.OSCredential).SecGroup().CreateRule(params)
	if err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}

	co.SetBody(structs.SuccessResponse{Success: true})
}

// Delete rule from security group
// @Summary   Delete rule from security group
// @Tags      SecGroup
// @Security  Authorization
// @Param     id   path      string  true  "Rule ID"
// @Success   200    {object}  structs.ResponseBody{body=structs.SuccessResponse}
// @Failure   400    {object}  structs.ResponseBody{body=object}
// @Failure   401    {object}  structs.ResponseBody{body=object}
// @Failure   500    {object}  structs.ResponseBody{body=object}
// @Router    /sec_group/delete_rule/:id [delete]
func (co SecGroupController) DeleteRule(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	ID := c.Param("id")
	auth := middlewares.GetAuth(c)
	if err := ostack.Connect(auth.OSCredential).SecGroup().DeleteRule(ID); err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}

	co.SetBody(structs.SuccessResponse{Success: true})
}
