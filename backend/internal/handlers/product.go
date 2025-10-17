package handlers

import (
	"encoding/csv"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"stockwise-backend/config"
	"stockwise-backend/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/jung-kurt/gofpdf"
)

func GetProducts(c *gin.Context) {
	var products []models.Product
	query := config.DB

	// Filtros
	if name := c.Query("name"); name != "" {
		query = query.Where("name ILIKE ?", "%"+name+"%")
	}
	if category := c.Query("category"); category != "" {
		query = query.Where("category = ?", category)
	}
	if minStr := c.Query("min"); minStr != "" {
		if min, err := strconv.Atoi(minStr); err == nil {
			query = query.Where("quantity >= ?", min)
		}
	}
	if maxStr := c.Query("max"); maxStr != "" {
		if max, err := strconv.Atoi(maxStr); err == nil {
			query = query.Where("quantity <= ?", max)
		}
	}

	if err := query.Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}

	c.JSON(http.StatusOK, products)
}

func CreateProduct(c *gin.Context) {
	var product models.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := config.DB.Create(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product"})
		return
	}

	c.JSON(http.StatusCreated, product)
}

func UpdateProduct(c *gin.Context) {
	id := c.Param("id")
	var product models.Product

	if err := config.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := config.DB.Save(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product"})
		return
	}

	c.JSON(http.StatusOK, product)
}

func GetStats(c *gin.Context) {
	var stats models.StatsResponse

	// Total de produtos
	config.DB.Model(&models.Product{}).Count(&stats.TotalProducts)

	// Produtos com estoque baixo
	config.DB.Model(&models.Product{}).Where("quantity <= min_stock").Count(&stats.LowStockProducts)

	// Produtos com estoque baixo (lista)
	config.DB.Where("quantity <= min_stock").Limit(10).Find(&stats.LowStockItems)

	// Movimentações mensais (últimos 6 meses)
	var movements []models.MonthlyMovement
	for i := 5; i >= 0; i-- {
		month := time.Now().AddDate(0, -i, 0)
		monthStr := month.Format("2006-01")
		
		var entradas, saidas int64
		config.DB.Model(&models.StockMovement{}).
			Where("type = ? AND DATE_TRUNC('month', created_at) = ?", "entrada", monthStr+"-01").
			Count(&entradas)
		
		config.DB.Model(&models.StockMovement{}).
			Where("type = ? AND DATE_TRUNC('month', created_at) = ?", "saida", monthStr+"-01").
			Count(&saidas)

		movements = append(movements, models.MonthlyMovement{
			Month:    month.Format("Jan 2006"),
			Entradas: int(entradas),
			Saidas:   int(saidas),
		})
	}
	stats.MonthlyMovements = movements

	// Breakdown por categoria
	var categories []models.CategoryBreakdown
	config.DB.Model(&models.Product{}).
		Select("category, COUNT(*) as count, SUM(price * quantity) as value").
		Group("category").
		Scan(&categories)
	stats.CategoryBreakdown = categories

	c.JSON(http.StatusOK, stats)
}

func GenerateReport(c *gin.Context) {
	format := c.Query("format")
	if format == "" {
		format = "pdf"
	}

	var products []models.Product
	config.DB.Find(&products)

	switch strings.ToLower(format) {
	case "csv":
		generateCSVReport(c, products)
	case "pdf":
		generatePDFReport(c, products)
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid format. Use 'pdf' or 'csv'"})
	}
}

func generateCSVReport(c *gin.Context, products []models.Product) {
	c.Header("Content-Type", "text/csv")
	c.Header("Content-Disposition", "attachment; filename=relatorio_estoque.csv")

	writer := csv.NewWriter(c.Writer)
	defer writer.Flush()

	// Cabeçalho
	writer.Write([]string{"ID", "Nome", "Categoria", "Quantidade", "Estoque Mínimo", "Preço", "Valor Total"})

	// Dados
	for _, product := range products {
		totalValue := product.Price * float64(product.Quantity)
		writer.Write([]string{
			strconv.Itoa(int(product.ID)),
			product.Name,
			product.Category,
			strconv.Itoa(product.Quantity),
			strconv.Itoa(product.MinStock),
			fmt.Sprintf("%.2f", product.Price),
			fmt.Sprintf("%.2f", totalValue),
		})
	}
}

func generatePDFReport(c *gin.Context, products []models.Product) {
	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.AddPage()
	pdf.SetFont("Arial", "B", 16)
	
	// Título
	pdf.Cell(190, 10, "Relatório de Estoque - StockWise")
	pdf.Ln(15)
	
	// Data
	pdf.SetFont("Arial", "", 10)
	pdf.Cell(190, 5, "Gerado em: "+time.Now().Format("02/01/2006 15:04"))
	pdf.Ln(10)
	
	// Cabeçalho da tabela
	pdf.SetFont("Arial", "B", 8)
	pdf.Cell(15, 7, "ID")
	pdf.Cell(50, 7, "Nome")
	pdf.Cell(30, 7, "Categoria")
	pdf.Cell(20, 7, "Qtd")
	pdf.Cell(20, 7, "Min")
	pdf.Cell(25, 7, "Preço")
	pdf.Cell(30, 7, "Total")
	pdf.Ln(7)
	
	// Dados
	pdf.SetFont("Arial", "", 8)
	var grandTotal float64
	for _, product := range products {
		totalValue := product.Price * float64(product.Quantity)
		grandTotal += totalValue
		
		pdf.Cell(15, 6, strconv.Itoa(int(product.ID)))
		pdf.Cell(50, 6, product.Name)
		pdf.Cell(30, 6, product.Category)
		pdf.Cell(20, 6, strconv.Itoa(product.Quantity))
		pdf.Cell(20, 6, strconv.Itoa(product.MinStock))
		pdf.Cell(25, 6, fmt.Sprintf("R$ %.2f", product.Price))
		pdf.Cell(30, 6, fmt.Sprintf("R$ %.2f", totalValue))
		pdf.Ln(6)
	}
	
	// Total geral
	pdf.Ln(5)
	pdf.SetFont("Arial", "B", 10)
	pdf.Cell(160, 8, "Total Geral:")
	pdf.Cell(30, 8, fmt.Sprintf("R$ %.2f", grandTotal))

	c.Header("Content-Type", "application/pdf")
	c.Header("Content-Disposition", "attachment; filename=relatorio_estoque.pdf")
	
	pdf.Output(c.Writer)
}