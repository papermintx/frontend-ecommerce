import axios from 'axios';
import type { Product, CheckoutItem, LoginResponse, Category } from '../models';

const API_BASE_URL = 'https://stylemarket.web.id/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper to get auth header
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// --- Products ---

export const getProducts = async (): Promise<Product[]> => {
    try {
        const response = await api.get('/products');
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

export const getProductDetail = async (id: number | string): Promise<Product> => {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product detail:", error);
        throw error;
    }
}

export const createProduct = async (formData: FormData): Promise<Product> => {
    try {
        const response = await api.post('/products', formData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
};

// Update not requested in refactor but good to have signature
export const updateProduct = async (id: number | string, formData: FormData): Promise<Product> => {
    try {
        const response = await api.put(`/products/${id}`, formData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
};

export const deleteProduct = async (id: number | string): Promise<void> => {
    try {
        await api.delete(`/products/${id}`, {
            headers: getAuthHeader(),
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
};

// --- Categories ---

export const getCategories = async (): Promise<Category[]> => {
    try {
        const response = await api.get('/categories');
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};

export const createCategory = async (name: string): Promise<Category> => {
    try {
        const response = await api.post('/categories', { name }, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
};

// --- Orders ---

export const checkout = async (items: CheckoutItem[]): Promise<string> => {
    try {
        const response = await api.post('/orders/checkout', { items });
        // Response format: { whatsappUrl: "..." }
        return response.data.whatsappUrl;
    } catch (error) {
        console.error("Error during checkout:", error);
        throw error;
    }
}

// --- Auth ---

// --- Auth ---

export const registerAdmin = async (data: { username: string; email: string; password: string }): Promise<{ message: string; userId: number }> => {
    try {
        const response = await api.post('/auth/register', { ...data, role: 'admin' });
        return response.data;
    } catch (error) {
        console.error("Register failed:", error);
        throw error;
    }
}

export const loginAdmin = async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    try {
        // Spec: /api/auth/login
        const response = await api.post('/auth/login', credentials);
        // Spec response: { token: "...", role: "admin" }
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role);
        }
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
};

export default api;
