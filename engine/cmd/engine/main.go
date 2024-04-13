package main

import (
	"github.com/gin-gonic/gin"
	"github.com/home-station-org/home-station/engine/internal/api"
)

func main() {
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.SetTrustedProxies(nil)

	api.Routes(r)

	if err := r.Run(":8080"); err != nil {
		panic(err)
	}
}
