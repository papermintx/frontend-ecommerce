import { motion } from 'framer-motion';
import { MessageCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../models';
import { getImageUrl, FALLBACK_IMAGE } from '../utils/image';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
    product: Product;
    onBuy: (product: Product) => void;
    index?: number;
}

const ProductCard = ({ product, onBuy, index = 0 }: ProductCardProps) => {
    const { t } = useLanguage();
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
        >
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4 cursor-pointer">
                <Link to={`/product/${product.id}`} className="block w-full h-full">
                    <img
                        src={getImageUrl(product.imageUrl)}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                        }}
                    />
                </Link>
                <button
                    onClick={() => onBuy(product)}
                    className="absolute bottom-3 left-3 right-3 bg-white/90 dark:bg-black/90 backdrop-blur text-black dark:text-white text-xs font-semibold py-2 rounded-lg shadow-lg transform translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 hover:bg-green-500 hover:text-white dark:hover:bg-green-600 cursor-pointer"
                >
                    <MessageCircle size={16} />
                    {t('buyViaWhatsapp')}
                </button>
                <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    4.8
                </div>
            </div>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5 transition-colors">{product.name}</h3>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1 transition-colors">{product.description}</p>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-200 transition-colors">
                    Rp {product.price ? product.price.toLocaleString('id-ID') : '0'}
                </p>
            </div>
        </motion.div>
    );
};

export default ProductCard;
