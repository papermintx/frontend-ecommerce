import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminProductList from '../components/AdminProductList';
import AdminProductForm from '../components/AdminProductForm';
import { getProducts, deleteProduct, logout } from '../services/api';
import type { Product } from '../models';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus } from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';

const AdminDashboard = () => {
    const { t } = useLanguage();
    const { showToast } = useToast();
    const [products, setProducts] = useState<Product[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Failed to load products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: number | string) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(id);
                // Refresh list
                await fetchProducts();
            } catch (error) {
                showToast("Failed to delete product.", 'error');
            }
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingProduct(null);
    };

    const handleFormSuccess = async () => {
        setIsFormOpen(false);
        setEditingProduct(null);

        // Clear products temporarily to force re-render
        setProducts([]);
        setLoading(true);

        // Small delay to ensure backend has saved the file
        await new Promise(resolve => setTimeout(resolve, 500));

        // Refresh products list with new data
        await fetchProducts();
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Navbar />

            <main className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-serif font-bold mb-2 dark:text-white">{t('adminDashboard')}</h1>
                        <p className="text-gray-600 dark:text-gray-400">{t('manageInventory')}</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleLogout}
                            className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                        >
                            <LogOut size={20} />
                            {t('signOut')}
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 transition-colors">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold dark:text-white">{t('inventory')}</h2>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-all flex items-center gap-2"
                        >
                            <Plus size={20} />
                            {t('addProduct')}
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                        </div>
                    ) : (
                        <AdminProductList
                            products={products}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    )}
                </div>
            </main>

            {isFormOpen && (
                <AdminProductForm
                    product={editingProduct}
                    onSuccess={handleFormSuccess}
                    onCancel={handleCloseForm}
                />
            )}

            <Footer />
        </div>
    );
};

export default AdminDashboard;
