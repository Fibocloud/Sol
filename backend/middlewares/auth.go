package middlewares

import (
	"net/http"

	"github.com/Fibocloud/Sol/backend/db"
	"github.com/Fibocloud/Sol/backend/structs"
	"github.com/Fibocloud/Sol/backend/utils"
	"github.com/gin-gonic/gin"
)

const authKey string = "user_auth"

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

		var user db.User
		if err := db.Instance.First(&user, claims.ID).Error; err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, resp)
			return
		}
		c.Set(authKey, &user)
		c.Next()
	}
}

func GetAuth(c *gin.Context) *db.User {
	return c.MustGet(authKey).(*db.User)
}
