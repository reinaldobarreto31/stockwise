import React, { useState, useEffect } from 'react';
import { Product, StatsResponse, productsAPI } from '../services/api';
import ProductForm from '../components/ProductForm';
import StockChart from '../components/StockChart';
import ReportButton from '../components/ReportButton';

interface HomeProps {
  user: any;
  onLogout: () => void;
}

const Home: React.FC<HomeProps> = ({ user, onLogout }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [activeTab, setActiveTab] = useState<'products' | 'dashboard' | 'reports'>('products');
  
  // Filtros
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    min: '',
    max: '',
  });

  useEffect(() => {
    loadProducts();
    loadStats();
  }, [filters]);

  const loadProducts = async () => {
    try {
      const params = {
        ...(filters.name && { name: filters.name }),
        ...(filters.category && { category: filters.category }),
        ...(filters.min && { min: parseInt(filters.min) }),
        ...(filters.max && { max: parseInt(filters.max) }),
      };
      const response = await productsAPI.getAll(params);
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await productsAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleSaveProduct = () => {
    setShowForm(false);
    setEditingProduct(undefined);
    loadProducts();
    loadStats();
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStockStatus = (product: Product) => {
    if (product.quantity <= product.min_stock) {
      return { status: 'low', color: '#dc2626', text: 'Estoque Baixo' };
    }
    if (product.quantity <= product.min_stock * 1.5) {
      return { status: 'medium', color: '#f59e0b', text: 'Atenção' };
    }
    return { status: 'good', color: '#059669', text: 'OK' };
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.logo}>📦 StockWise</h1>
          <span style={styles.welcome}>Olá, {user?.name}!</span>
        </div>
        <button onClick={onLogout} style={styles.logoutButton}>
          Sair
        </button>
      </header>

      {/* Navigation */}
      <nav style={styles.nav}>
        <button
          style={{
            ...styles.navButton,
            ...(activeTab === 'products' ? styles.activeNavButton : {}),
          }}
          onClick={() => setActiveTab('products')}
        >
          📦 Produtos
        </button>
        <button
          style={{
            ...styles.navButton,
            ...(activeTab === 'dashboard' ? styles.activeNavButton : {}),
          }}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          style={{
            ...styles.navButton,
            ...(activeTab === 'reports' ? styles.activeNavButton : {}),
          }}
          onClick={() => setActiveTab('reports')}
        >
          📄 Relatórios
        </button>
      </nav>

      {/* Content */}
      <main style={styles.main}>
        {activeTab === 'products' && (
          <>
            {/* Filters */}
            <div style={styles.filtersCard}>
              <h3 style={styles.filtersTitle}>Filtros</h3>
              <div style={styles.filtersGrid}>
                <input
                  type="text"
                  placeholder="Buscar por nome..."
                  value={filters.name}
                  onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                  style={styles.filterInput}
                />
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  style={styles.filterInput}
                >
                  <option value="">Todas as categorias</option>
                  <option value="Alimentos">Alimentos</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Limpeza">Limpeza</option>
                  <option value="Higiene">Higiene</option>
                  <option value="Eletrônicos">Eletrônicos</option>
                  <option value="Roupas">Roupas</option>
                  <option value="Outros">Outros</option>
                </select>
                <input
                  type="number"
                  placeholder="Qtd. mínima"
                  value={filters.min}
                  onChange={(e) => setFilters({ ...filters, min: e.target.value })}
                  style={styles.filterInput}
                />
                <input
                  type="number"
                  placeholder="Qtd. máxima"
                  value={filters.max}
                  onChange={(e) => setFilters({ ...filters, max: e.target.value })}
                  style={styles.filterInput}
                />
                <button
                  onClick={() => setShowForm(true)}
                  style={styles.addButton}
                >
                  + Novo Produto
                </button>
              </div>
            </div>

            {/* Products List */}
            <div style={styles.productsCard}>
              <h3 style={styles.productsTitle}>
                Produtos ({products.length})
              </h3>
              
              {loading ? (
                <div style={styles.loading}>Carregando...</div>
              ) : products.length === 0 ? (
                <div style={styles.empty}>
                  Nenhum produto encontrado.
                </div>
              ) : (
                <div style={styles.productsGrid}>
                  {products.map((product) => {
                    const stockStatus = getStockStatus(product);
                    return (
                      <div key={product.id} style={styles.productCard}>
                        <div style={styles.productHeader}>
                          <h4 style={styles.productName}>{product.name}</h4>
                          <span
                            style={{
                              ...styles.stockBadge,
                              backgroundColor: stockStatus.color,
                            }}
                          >
                            {stockStatus.text}
                          </span>
                        </div>
                        
                        <p style={styles.productCategory}>{product.category}</p>
                        
                        {product.description && (
                          <p style={styles.productDescription}>
                            {product.description}
                          </p>
                        )}
                        
                        <div style={styles.productStats}>
                          <div style={styles.stat}>
                            <span style={styles.statLabel}>Quantidade:</span>
                            <span style={styles.statValue}>{product.quantity}</span>
                          </div>
                          <div style={styles.stat}>
                            <span style={styles.statLabel}>Mín.:</span>
                            <span style={styles.statValue}>{product.min_stock}</span>
                          </div>
                          <div style={styles.stat}>
                            <span style={styles.statLabel}>Preço:</span>
                            <span style={styles.statValue}>
                              {formatCurrency(product.price)}
                            </span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleEditProduct(product)}
                          style={styles.editButton}
                        >
                          ✏️ Editar
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'dashboard' && stats && (
          <StockChart stats={stats} />
        )}

        {activeTab === 'reports' && (
          <ReportButton />
        )}
      </main>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(undefined);
          }}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: 'white',
    padding: '16px 24px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0,
  },
  welcome: {
    color: '#6b7280',
    fontSize: '14px',
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  nav: {
    backgroundColor: 'white',
    padding: '0 24px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    gap: '8px',
  },
  navButton: {
    padding: '12px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
  },
  activeNavButton: {
    color: '#3b82f6',
    borderBottomColor: '#3b82f6',
  },
  main: {
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  filtersCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '24px',
  },
  filtersTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '16px',
  },
  filtersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    alignItems: 'end',
  },
  filterInput: {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none',
  },
  addButton: {
    padding: '10px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  productsCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  productsTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '16px',
  },
  loading: {
    textAlign: 'center' as const,
    padding: '40px',
    color: '#6b7280',
  },
  empty: {
    textAlign: 'center' as const,
    padding: '40px',
    color: '#6b7280',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  },
  productCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#fafafa',
  },
  productHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
  },
  productName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0,
    flex: 1,
  },
  stockBadge: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    color: 'white',
  },
  productCategory: {
    fontSize: '12px',
    color: '#6b7280',
    margin: '0 0 8px 0',
  },
  productDescription: {
    fontSize: '14px',
    color: '#4b5563',
    margin: '0 0 12px 0',
    lineHeight: '1.4',
  },
  productStats: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: '12px',
    color: '#6b7280',
  },
  statValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1f2937',
  },
  editButton: {
    width: '100%',
    padding: '8px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#374151',
  },
};

export default Home;