package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/home-station-org/engine/internal/db"
)

func main() {
	r := gin.Default()

	r.GET("/api/v1/marketplaces/list", func(c *gin.Context) {
		c.JSON(http.StatusOK, Db.Find(&Marketplace{}))
	})

	if err := r.Run(":8080"); err != nil {
		panic(err)
	}
}
