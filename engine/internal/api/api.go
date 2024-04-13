package api

import (
	"github.com/gin-gonic/gin"
	"github.com/home-station-org/home-station/engine/internal/api/marketplaces"
)

func Routes(r *gin.Engine) {
	marketplaceapi.MarketplaceRoutes(r)
}
