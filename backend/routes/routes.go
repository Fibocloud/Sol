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
	controllers.UserController{Controller: bc}.Register(app.Group("user"))
}
