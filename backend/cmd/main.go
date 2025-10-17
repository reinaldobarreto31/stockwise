package main

import (
	"log"
	"stockwise-backend/config"
	"stockwise-backend/internal/handlers"
	"stockwise-backend/internal/middleware"
	"stockwise-backend/internal/models"

	"github.com/gin-gonic/gin"
)

func main() {
	// Conectar ao banco de dados
	config.ConnectDB()

	// Migrar modelos
	err := config.DB.AutoMigrate(&models.User{}, &models.Product{}, &models.StockMovement{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	// Configurar Gin
	r := gin.Default()

	// Middleware CORS
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization")
		
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		
		c.Next()
	})

	// Rotas públicas
	public := r.Group("/api")
	{
		public.POST("/register", handlers.Register)
		public.POST("/login", handlers.Login)
	}

	// Rotas protegidas
	protected := r.Group("/api")
	protected.Use(middleware.JWTMiddleware())
	{
		// Produtos
		protected.GET("/products", handlers.GetProducts)
		protected.POST("/products", handlers.CreateProduct)
		protected.PUT("/products/:id", handlers.UpdateProduct)
		
		// Estatísticas
		protected.GET("/stats", handlers.GetStats)
		
		// Relatórios
		protected.GET("/report", handlers.GenerateReport)
	}

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"service": "stockwise-backend",
		})
	})

	log.Println("Server starting on port 8080...")
	r.Run(":8080")
}