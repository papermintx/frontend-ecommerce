import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getProductDetail, checkout } from '../services/api';
import type { Product } from '../models';
import { getImageUrl, FALLBACK_IMAGE } from '../utils/image';
import { MessageCircle, ArrowLeft, ChevronLeft, ChevronRight, CreditCard, AlertCircle, Copy, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';

const ProductDetailPage = () => {
    const { t } = useLanguage();
    const { showToast } = useToast();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    // Gallery State
    const [allImages, setAllImages] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    // Payment Info (could be from env or config)
    const paymentInfo = {
        gopay: '+62 813-8909-0654',
        dana: '+62 813-8909-0654'
    };

    useEffect(() => {
        const fetchDetail = async () => {
            if (!id) return;
            try {
                const data = await getProductDetail(id);
                setProduct(data);

                // Consolidate all images
                const mainImg = data.imageUrl ? getImageUrl(data.imageUrl) : FALLBACK_IMAGE;
                const galleryImgs = data.galleries?.map((g: any) => getImageUrl(g.imageUrl)) || [];
                setAllImages([mainImg, ...galleryImgs]);

            } catch (error) {
                console.error("Failed to fetch product detail", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        let newIndex = currentIndex + newDirection;
        if (newIndex < 0) newIndex = allImages.length - 1;
        if (newIndex >= allImages.length) newIndex = 0;
        setCurrentIndex(newIndex);
    };

    const handleContactAdmin = async () => {
        if (!product) return;
        try {
            const whatsappUrl = await checkout([{ productId: product.id, quantity: quantity }]);
            window.open(whatsappUrl, '_blank');
        } catch (error) {
            showToast(t('error'), 'error');
        }
    };

    const handleDirectPayment = () => {
        setIsPaymentModalOpen(true);
    };

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const incrementQuantity = () => {
        if (product && quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const totalPrice = product ? product.price * quantity : 0;

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                <p className="text-xl mb-4">{t('productNotFound')}</p>
                <button onClick={() => navigate('/marketplace')} className="underline">{t('backToMarketplace')}</button>
            </div>
        );
    }

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    return (
        <div className="min-h-screen font-sans bg-white dark:bg-gray-900 selection:bg-orange-100 selection:text-orange-900 transition-colors duration-300">
            <Navbar />
            <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft size={20} /> {t('back')}
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Carousel Section */}
                    <div className="space-y-4">
                        <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm group select-none transition-colors">
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.img
                                    key={currentIndex}
                                    src={allImages[currentIndex]}
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 }
                                    }}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={1}
                                    onDragEnd={(_, { offset, velocity }) => {
                                        const swipe = Math.abs(offset.x) * velocity.x;
                                        if (swipe < -10000) {
                                            paginate(1);
                                        } else if (swipe > 10000) {
                                            paginate(-1);
                                        }
                                    }}
                                    className="absolute w-full h-full object-cover cursor-grab active:cursor-grabbing"
                                    alt={product.name}
                                />
                            </AnimatePresence>

                            {/* Arrows */}
                            {allImages.length > 1 && (
                                <>
                                    <button
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-900 text-black dark:text-white"
                                        onClick={() => paginate(-1)}
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-900 text-black dark:text-white"
                                        onClick={() => paginate(1)}
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {allImages.map((img, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => {
                                            setDirection(idx > currentIndex ? 1 : -1);
                                            setCurrentIndex(idx);
                                        }}
                                        className={`w-24 h-24 flex-shrink-0 cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${currentIndex === idx ? 'border-black dark:border-white' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" alt={`thumb-${idx}`} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4 transition-colors">{product.name}</h1>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-200 mb-2 transition-colors">Rp {product.price.toLocaleString('id-ID')}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">{t('perItem')}</p>

                        <div className="prose prose-lg text-gray-600 dark:text-gray-300 mb-10 transition-colors">
                            <p>{product.description}</p>
                        </div>

                        <div className="space-y-6">
                            {/* Stock Info */}
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 transition-colors">
                                <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full transition-colors">
                                    {t('stock')}: {product.stock}
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('quantity')}:</label>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                                        <button
                                            onClick={decrementQuantity}
                                            className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-bold text-lg disabled:opacity-50"
                                            disabled={quantity <= 1}
                                        >
                                            −
                                        </button>
                                        <span className="px-6 py-2 font-semibold text-gray-900 dark:text-white min-w-[3rem] text-center">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={incrementQuantity}
                                            className="px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-bold text-lg disabled:opacity-50"
                                            disabled={quantity >= product.stock}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                                            {t('total')}: Rp {totalPrice.toLocaleString('id-ID')}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {quantity} × Rp {product.price.toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Options */}
                            <div className="space-y-3">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('choosePaymentMethod')}</p>

                                {/* Recommended: Contact Admin First */}
                                <button
                                    onClick={handleContactAdmin}
                                    className="w-full px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold text-base hover:bg-gray-800 dark:hover:bg-gray-200 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl border-2 border-black dark:border-white"
                                >
                                    <MessageCircle size={22} />
                                    {t('contactAdminFirst')}
                                </button>
                                <p className="text-xs text-green-600 dark:text-green-400 text-center">
                                    ✓ {t('recommendedConsult')}
                                </p>

                                {/* Direct Payment Option */}
                                <button
                                    onClick={handleDirectPayment}
                                    className="w-full px-8 py-4 bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl font-semibold text-base hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl border border-gray-300 dark:border-gray-600"
                                >
                                    <CreditCard size={22} />
                                    {t('payDirectly')}
                                </button>
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                    {t('viewPaymentNumbers')}
                                </p>
                            </div>

                            <p className="text-xs text-gray-400 text-center md:text-left max-w-sm">
                                {t('whatsappDisclaimer')}
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Payment Modal */}
                {isPaymentModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('paymentInformation')}</h3>
                                <button
                                    onClick={() => setIsPaymentModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <X size={20} className="text-gray-500 dark:text-gray-400" />
                                </button>
                            </div>

                            {/* Warning */}
                            <div className="px-6 py-4 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
                                <div className="flex gap-3">
                                    <AlertCircle className="text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" size={20} />
                                    <div className="text-sm text-yellow-800 dark:text-yellow-200 space-y-2">
                                        <p className="font-semibold">⚠️ {t('importantNotice')}</p>
                                        <ul className="list-disc list-inside space-y-1 text-xs">
                                            <li>{t('mustConfirmPayment')}</li>
                                            <li>{t('shippingNotIncluded')}</li>
                                            <li>{t('contactAdminShipping')}</li>
                                            <li><strong>{t('recommendedContactFirst')}</strong></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Details */}
                            <div className="px-6 py-6 space-y-6">
                                {/* GoPay */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">GoPay</label>
                                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                        <code className="flex-1 text-sm font-mono text-gray-900 dark:text-white">
                                            {paymentInfo.gopay}
                                        </code>
                                        <button
                                            onClick={() => copyToClipboard(paymentInfo.gopay, 'gopay')}
                                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                                        >
                                            {copiedField === 'gopay' ? (
                                                <Check size={18} className="text-green-600" />
                                            ) : (
                                                <Copy size={18} className="text-gray-500" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* DANA */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">DANA</label>
                                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                        <code className="flex-1 text-sm font-mono text-gray-900 dark:text-white">
                                            {paymentInfo.dana}
                                        </code>
                                        <button
                                            onClick={() => copyToClipboard(paymentInfo.dana, 'dana')}
                                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                                        >
                                            {copiedField === 'dana' ? (
                                                <Check size={18} className="text-green-600" />
                                            ) : (
                                                <Copy size={18} className="text-gray-500" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                            <span>{t('unitPrice')}</span>
                                            <span>Rp {product.price.toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                            <span>{t('quantity')}:</span>
                                            <span>{quantity} {t('pieces')}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                                            <span className="font-medium text-gray-900 dark:text-white">{t('totalPrice')}</span>
                                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                                                Rp {totalPrice.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                        {t('shippingNotIncludedNote')}
                                    </p>
                                </div>

                                {/* WhatsApp Confirmation Button */}
                                <button
                                    onClick={handleContactAdmin}
                                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                                >
                                    <MessageCircle size={20} />
                                    {t('confirmPaymentToAdmin')}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default ProductDetailPage;
