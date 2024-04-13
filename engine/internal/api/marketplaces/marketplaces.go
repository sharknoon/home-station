package marketplaceapi

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/home-station-org/home-station/engine/internal/db"
)

func MarketplaceRoutes(r *gin.Engine) {
	r.GET("/api/v1/marketplaces/list", func(c *gin.Context) {
		var marketplaces []db.Marketplace
		db.Db.Find(&marketplaces)
		c.JSON(http.StatusOK, marketplaces)
	})

	r.POST("/api/v1/marketplaces/create", func(c *gin.Context) {
		var marketplace db.Marketplace
		if err := c.ShouldBindJSON(&marketplace); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		db.Db.Create(&marketplace)
		c.JSON(http.StatusOK, marketplace)
	})

	r.DELETE("/api/v1/marketplaces/delete/:id", func(c *gin.Context) {
		id := c.Param("id")
		db.Db.Delete(&db.Marketplace{}, id)
		c.JSON(http.StatusOK, gin.H{"id": id})
	})
}