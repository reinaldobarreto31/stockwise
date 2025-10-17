import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  quantity: number;
  min_stock: number;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface StatsResponse {
  total_products: number;
  low_stock_products: number;
  monthly_movements: MonthlyMovement[];
  category_breakdown: CategoryBreakdown[];
  low_stock_items: Product[];
}

export interface MonthlyMovement {
  month: string;
  entradas: number;
  saidas: number;
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  value: number;
}

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/login', { email, password }),
  
  register: (name: string, email: string, password: string) =>
    api.post<AuthResponse>('/register', { name, email, password }),
};

// Products API
export const productsAPI = {
  getAll: (params?: { name?: string; category?: string; min?: number; max?: number }) =>
    api.get<Product[]>('/products', { params }),
  
  create: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) =>
    api.post<Product>('/products', product),
  
  update: (id: number, product: Partial<Product>) =>
    api.put<Product>(`/products/${id}`, product),
  
  getStats: () =>
    api.get<StatsResponse>('/stats'),
  
  generateReport: (format: 'pdf' | 'csv' = 'pdf') => {
    return api.get('/report', {
      params: { format },
      responseType: 'blob',
    });
  },
};

export default api;