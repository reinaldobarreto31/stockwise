import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { StatsResponse } from '../services/api';

interface StockChartProps {
  stats: StatsResponse;
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

const StockChart: React.FC<StockChartProps> = ({ stats }) => {
  return (
    <div style={styles.container}>
      {/* Cards de Resumo */}
      <div style={styles.cardsGrid}>
        <div style={styles.card}>
          <div style={styles.cardIcon}>📦</div>
          <div>
            <div style={styles.cardValue}>{stats.total_products}</div>
            <div style={styles.cardLabel}>Total de Produtos</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={{ ...styles.cardIcon, backgroundColor: '#fef2f2', color: '#dc2626' }}>⚠️</div>
          <div>
            <div style={styles.cardValue}>{stats.low_stock_products}</div>
            <div style={styles.cardLabel}>Estoque Baixo</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={{ ...styles.cardIcon, backgroundColor: '#f0fdf4', color: '#16a34a' }}>📈</div>
          <div>
            <div style={styles.cardValue}>
              {stats.monthly_movements.reduce((acc, curr) => acc + curr.entradas, 0)}
            </div>
            <div style={styles.cardLabel}>Entradas (6 meses)</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={{ ...styles.cardIcon, backgroundColor: '#fef2f2', color: '#dc2626' }}>📉</div>
          <div>
            <div style={styles.cardValue}>
              {stats.monthly_movements.reduce((acc, curr) => acc + curr.saidas, 0)}
            </div>
            <div style={styles.cardLabel}>Saídas (6 meses)</div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div style={styles.chartsGrid}>
        {/* Gráfico de Movimentações Mensais */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Movimentações Mensais</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.monthly_movements}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="entradas" fill="#10b981" name="Entradas" />
              <Bar dataKey="saidas" fill="#ef4444" name="Saídas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Categorias */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Produtos por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.category_breakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, count }) => `${category}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {stats.category_breakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lista de Produtos com Estoque Baixo */}
      {stats.low_stock_items.length > 0 && (
        <div style={styles.lowStockCard}>
          <h3 style={styles.chartTitle}>⚠️ Produtos com Estoque Baixo</h3>
          <div style={styles.lowStockList}>
            {stats.low_stock_items.map((product) => (
              <div key={product.id} style={styles.lowStockItem}>
                <div>
                  <div style={styles.productName}>{product.name}</div>
                  <div style={styles.productCategory}>{product.category}</div>
                </div>
                <div style={styles.stockInfo}>
                  <span style={styles.currentStock}>{product.quantity}</span>
                  <span style={styles.minStock}>/ {product.min_stock} mín.</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
  },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  cardIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: '#eff6ff',
    color: '#3b82f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  cardValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
  },
  cardLabel: {
    fontSize: '14px',
    color: '#6b7280',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px',
  },
  chartCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '16px',
  },
  lowStockCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  lowStockList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  lowStockItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#fef2f2',
    borderRadius: '8px',
    border: '1px solid #fecaca',
  },
  productName: {
    fontWeight: '500',
    color: '#1f2937',
  },
  productCategory: {
    fontSize: '12px',
    color: '#6b7280',
  },
  stockInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  currentStock: {
    fontWeight: 'bold',
    color: '#dc2626',
  },
  minStock: {
    fontSize: '12px',
    color: '#6b7280',
  },
};

export default StockChart;