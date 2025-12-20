import { motion } from 'framer-motion';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';
import type { Product } from '../models';
import { getImageUrl, FALLBACK_IMAGE } from '../utils/image';
import { useLanguage } from '../context/LanguageContext';

const FeaturedCollection = () => {
    const { t } = useLanguage();
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                // Filter out out-of-stock products
                const validProducts = data.filter((p: Product) => p.stock > 0);
                // Sort by ID descending to get newest first
                const sortedData = validProducts.sort((a: any, b: any) => b.id - a.id);
                setProducts(sortedData.slice(0, 3));
            } catch (error) {
                console.error("Failed to fetch featured products", error);
            }
        };
        fetchProducts();
    }, []);

    if (products.length === 0) return null; // Hide if no products

    return (
        <section id="collection" className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl font-serif font-bold mb-3 dark:text-white"
                    >
                        {t('newArrivals')}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                    >
                        {t('latestProductsDesc')}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {products.map((product, index) => (
                        <Link key={product.id} to={`/product/${product.id}`}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                className="group cursor-pointer relative aspect-[3/4] overflow-hidden rounded-2xl"
                            >
                                <img
                                    src={getImageUrl(product.imageUrl)}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                                <div className="absolute bottom-6 left-6 text-white">
                                    <h3 className="text-2xl font-bold mb-1">{product.name}</h3>
                                    <p className="text-sm font-medium opacity-90 mb-2">
                                        Rp {parseInt(product.price.toString()).toLocaleString('id-ID')}
                                    </p>
                                    <span className="text-sm font-medium border-b border-white pb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                                        {t('viewDetails')}
                                    </span>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link to="/marketplace" className="inline-block px-8 py-3 border-2 border-black dark:border-white text-black dark:text-white font-semibold rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
                        {t('viewAllProducts')}
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedCollection;
