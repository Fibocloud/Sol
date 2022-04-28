package controllers

import (
	"net/http"

	"github.com/Fibocloud/Sol/backend/middlewares"
	"github.com/Fibocloud/Sol/backend/ostack"
	"github.com/gin-gonic/gin"
)

type SystemController struct {
	Controller
}

func (co SystemController) Register(router *gin.RouterGroup) {
	private := router.Group("").Use(middlewares.Auth())
	private.GET("compute", co.Compute)
	private.GET("limit", co.Limit)
}

// System compute
// @Summary   System compute
// @Tags      System
// @Security  Authorization
// @Success   200  {object}  structs.ResponseBody{body=interface{}}
// @Failure   400  {object}  structs.ResponseBody{body=object}
// @Failure   401  {object}  structs.ResponseBody{body=object}
// @Failure   500  {object}  structs.ResponseBody{body=object}
// @Router    /hypervisor/compute [get]
func (co SystemController) Compute(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	auth := middlewares.GetAuth(c)
	statistics, err := ostack.Connect(auth.OSCredential).Hypervisor().GetStatistics()
	if err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}
	co.SetBody(statistics)
}

// System limit
// @Summary   System limit
// @Tags      System
// @Security  Authorization
// @Success   200  {object}  structs.ResponseBody{body=interface{}}
// @Failure   400  {object}  structs.ResponseBody{body=object}
// @Failure   401  {object}  structs.ResponseBody{body=object}
// @Failure   500  {object}  structs.ResponseBody{body=object}
// @Router    /hypervisor/limit [get]
func (co SystemController) Limit(c *gin.Context) {
	defer func() {
		c.JSON(co.GetBody())
	}()

	auth := middlewares.GetAuth(c)
	novaLimit, err := ostack.Connect(auth.OSCredential).Limit().GetNova()
	if err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}
	cinderLimit, err := ostack.Connect(auth.OSCredential).Limit().GetCinder()
	if err != nil {
		co.SetError(http.StatusInternalServerError, err.Error())
		return
	}
	co.SetBody(map[string]interface{}{
		"compute": novaLimit,
		"storage": cinderLimit,
	})
}
