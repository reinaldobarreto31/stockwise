package models

import (
	"time"
)

type Product struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Name        string    `json:"name" gorm:"not null"`
	Description string    `json:"description"`
	Category    string    `json:"category" gorm:"not null"`
	Quantity    int       `json:"quantity" gorm:"default:0"`
	MinStock    int       `json:"min_stock" gorm:"default:10"`
	Price       float64   `json:"price" gorm:"type:decimal(10,2)"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type StockMovement struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	ProductID uint      `json:"product_id" gorm:"not null"`
	Product   Product   `json:"product" gorm:"foreignKey:ProductID"`
	Type      string    `json:"type" gorm:"not null"` // "entrada" ou "saida"
	Quantity  int       `json:"quantity" gorm:"not null"`
	Reason    string    `json:"reason"`
	CreatedAt time.Time `json:"created_at"`
}

type StatsResponse struct {
	TotalProducts     int64                    `json:"total_products"`
	LowStockProducts  int64                    `json:"low_stock_products"`
	MonthlyMovements  []MonthlyMovement        `json:"monthly_movements"`
	CategoryBreakdown []CategoryBreakdown      `json:"category_breakdown"`
	LowStockItems     []Product                `json:"low_stock_items"`
}

type MonthlyMovement struct {
	Month    string `json:"month"`
	Entradas int    `json:"entradas"`
	Saidas   int    `json:"saidas"`
}

type CategoryBreakdown struct {
	Category string `json:"category"`
	Count    int64  `json:"count"`
	Value    float64 `json:"value"`
}