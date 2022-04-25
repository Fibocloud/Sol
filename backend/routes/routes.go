package routes

import (
	"net/http"

	"github.com/Fibocloud/Sol/backend/controllers"
	"github.com/Fibocloud/Sol/backend/structs"
	"github.com/gin-gonic/gin"
)

func Router(app *gin.RouterGroup) {
	bc := controllers.Controller{
		Response: &structs.Response{
			StatusCode: http.StatusOK,
			Body:       structs.ResponseBody{Message: "", Body: nil},
		},
	}

	controllers.AuthController{Controller: bc}.Register(app.Group("auth"))
	controllers.InstanceController{Controller: bc}.Register(app.Group("instance"))
	controllers.KeypairController{Controller: bc}.Register(app.Group("keypair"))
	controllers.ImageController{Controller: bc}.Register(app.Group("image"))
	controllers.FlavorController{Controller: bc}.Register(app.Group("flavor"))
	controllers.NetworkController{Controller: bc}.Register(app.Group("network"))
	controllers.SecGroupController{Controller: bc}.Register(app.Group("sec_group"))
}
