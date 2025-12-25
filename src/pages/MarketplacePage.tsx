import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { getProducts, getCategories, checkout } from '../services/api';
import type { Product, Category } from '../models';

import { useLanguage } from '../context/LanguageContext';

const MarketplacePage = () => {
    const { t } = useLanguage();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Get categoryId from URL query parameter
    const selectedCategoryId = searchParams.get('categoryId');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsData, categoriesData] = await Promise.all([
                    getProducts(),
                    getCategories()
                ]);

                setCategories(categoriesData);

                // Filter products based on category and stock
                let validProducts = productsData.filter((p: Product) => p.stock > 0);

                // Apply category filter if categoryId is in URL
                if (selectedCategoryId) {
                    validProducts = validProducts.filter((p: Product) =>
                        p.categoryId === parseInt(selectedCategoryId)
                    );
                }

                setProducts(validProducts);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedCategoryId]);

    const handleBuy = async (product: Product) => {
        try {
            const whatsappUrl = await checkout([{ productId: product.id, quantity: 1 }]);
            window.open(whatsappUrl, '_blank');
        } catch (error) {
            alert(t('error'));
        }
    };

    const handleCategoryChange = (categoryId: string) => {
        if (categoryId === '') {
            navigate('/marketplace');
        } else {
            navigate(`/marketplace?categoryId=${categoryId}`);
        }
    };

    // Get selected category name for display
    const selectedCategory = categories.find(c => c.id === parseInt(selectedCategoryId || '0'));

    return (
        <div className="min-h-screen font-sans bg-white dark:bg-gray-900 selection:bg-orange-100 selection:text-orange-900 transition-colors duration-300">
            <Navbar />
            <main className="pt-16">
                <section id="marketplace" className="py-16 bg-white dark:bg-gray-900 transition-colors">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-serif font-bold mb-3 dark:text-white">
                                {selectedCategory ? selectedCategory.name : t('marketplaceTitle')}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                {selectedCategory
                                    ? `Browse our ${selectedCategory.name.toLowerCase()} collection`
                                    : t('marketplaceDesc')
                                }
                            </p>
                        </div>

                        {/* Compact Filter Section */}
                        <div className="mb-6 flex justify-center items-center gap-3">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('category')}:
                            </label>
                            <select
                                value={selectedCategoryId || ''}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-all"
                            >
                                <option value="">{t('allCategories')}</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {selectedCategoryId && (
                                <button
                                    onClick={() => handleCategoryChange('')}
                                    className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline transition-colors"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        {loading ? (
                            <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-16">
                                <p className="text-gray-500 dark:text-gray-400 text-lg">
                                    {selectedCategoryId
                                        ? 'No products found in this category'
                                        : 'No products available'}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product, index) => (
                                    <ProductCard key={product.id} product={product} onBuy={handleBuy} index={index} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default MarketplacePage;
