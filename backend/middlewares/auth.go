package middlewares

import (
	"net/http"

	"github.com/Fibocloud/Sol/backend/db"
	"github.com/Fibocloud/Sol/backend/structs"
	"github.com/Fibocloud/Sol/backend/utils"
	"github.com/gin-gonic/gin"
)

const authKey string = "admin_auth"

func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		requiredToken := c.Request.Header["Authorization"]
		resp := structs.ResponseBody{Message: "Хандалтын хугацаа дууссан байна. Дахин нэвтэрнэ үү", Body: nil}
		if len(requiredToken) == 0 || len(requiredToken[0]) < 8 {
			c.AbortWithStatusJSON(http.StatusUnauthorized, resp)
			return
		}

		claims, err := utils.ExtractJWTString(requiredToken[0][7:])
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, resp)
			return
		}

		var admin db.Admin
		if err := db.Instance.First(&admin, claims.ID).Error; err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, resp)
			return
		}
		c.Set(authKey, &admin)
		c.Next()
	}
}

func GetAuth(c *gin.Context) *db.Admin {
	return c.MustGet(authKey).(*db.Admin)
}
