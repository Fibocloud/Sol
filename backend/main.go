package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/Fibocloud/Sol/backend/db"
	"github.com/Fibocloud/Sol/backend/middlewares"
	"github.com/Fibocloud/Sol/backend/redis"
	"github.com/Fibocloud/Sol/backend/routes"
	"github.com/Fibocloud/Sol/backend/swagger"
	"github.com/Fibocloud/Sol/backend/utils"
	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

// @title           Sol API
// @version         1.0
// @description     Sol backend api.
// @termsOfService  https://uuree.fibo.cloud/

// @contact.name   API Support
// @contact.url    https://www.facebook.com/uurtsaikh.n
// @contact.email  vvrtsaix.n@gmail.com

// @license.name  MIT
// @license.url   https://opensource.org/licenses/MIT

// @BasePath  /api/v1
// @schemes   http https
// @accept    json
// @produce   json

// @securityDefinitions.apikey  Authorization
// @in                          header
// @name                        Authorization
func main() {
	utils.LoadConfig()
	db.Connect()
	redis.Connect()
	gin.SetMode(viper.GetString("APP_MODE"))
	app := gin.Default()
	app.SetTrustedProxies(nil)
	app.Use(middlewares.CORS)
	app.Use(gzip.Gzip(gzip.DefaultCompression))
	swagger.Init(app)
	app.GET("/", func(c *gin.Context) {
		defer func() {
			c.JSON(http.StatusOK, gin.H{"alive": true, "ready": true})
		}()
	})
	routes.Router(app.Group("/api/v1"))
	log.Fatalln(
		app.Run(
			fmt.Sprintf("0.0.0.0:%d", viper.GetInt("APP_PORT")),
		),
	)
}
