export interface Category {
    id: number;
    name: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    categoryId?: number;
    category?: Category;
    createdAt?: string;
    updatedAt?: string;
    // For detail view
    galleries?: { url: string }[];
}

export interface User {
    id?: number;
    email?: string;
    role: 'admin';
}

export interface LoginResponse {
    token: string;
    role: 'admin';
}

export interface CheckoutItem {
    productId: number | string;
    quantity: number;
}
