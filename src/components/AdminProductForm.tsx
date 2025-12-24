import { useState, useEffect } from 'react';
import { createProduct, updateProduct, getCategories } from '../services/api';
import { X, Upload } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import type { Category, Product } from '../models';

interface AdminProductFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    product?: Product | null; // Optional product for edit mode
}

const AdminProductForm = ({ onSuccess, onCancel, product }: AdminProductFormProps) => {
    const { t } = useLanguage();
    const { showToast } = useToast();
    const isEditMode = !!product;

    const [name, setName] = useState(product?.name || '');
    const [price, setPrice] = useState(product?.price?.toString() || '');
    const [description, setDescription] = useState(product?.description || '');
    const [stock, setStock] = useState(product?.stock?.toString() || '');
    const [categoryId, setCategoryId] = useState(product?.categoryId?.toString() || '');
    const [categories, setCategories] = useState<Category[]>([]);
    const [image, setImage] = useState<File | null>(null);
    const [gallery, setGallery] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error('Failed to fetch categories', error);
            }
        };
        fetchCategories();
    }, []);

    // Update form when product changes
    useEffect(() => {
        if (product) {
            setName(product.name || '');
            setPrice(product.price?.toString() || '');
            setDescription(product.description || '');
            setStock(product.stock?.toString() || '');
            setCategoryId(product.categoryId?.toString() || '');
        }
    }, [product]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('description', description);
        formData.append('stock', stock);
        if (categoryId) formData.append('categoryId', categoryId);
        if (image) {
            formData.append('image', image);
            console.log('📤 Uploading main image:', image.name, image.size, 'bytes');
        }
        // Gallery handling if API supports multiple files under same key or distinct keys
        gallery.forEach((file) => {
            formData.append('gallery', file);
            console.log('📤 Uploading gallery image:', file.name, file.size, 'bytes');
        });

        try {
            if (isEditMode && product) {
                console.log('🔄 Updating product ID:', product.id);
                const response = await updateProduct(product.id, formData);
                console.log('✅ Update response:', response);
                console.log('🖼️ New imageUrl:', response.imageUrl);
                showToast(t('productUpdatedSuccess'), 'success');
            } else {
                console.log('➕ Creating new product');
                const response = await createProduct(formData);
                console.log('✅ Create response:', response);
                showToast(t('productCreatedSuccess'), 'success');
            }
            onSuccess();
        } catch (error: any) {
            console.error('❌ Error:', error);
            console.error('❌ Error Response:', error.response?.data);
            console.error('❌ Error Status:', error.response?.status);
            console.error('❌ Error Headers:', error.response?.headers);

            const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
            showToast(`${isEditMode ? t('productUpdateFail') : t('productCreateFail')}: ${errorMessage}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-colors">
            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-black dark:border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {isEditMode ? t('updating') : t('creating')}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Please wait...
                        </p>
                    </div>
                </div>
            )}
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl transition-colors">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10 transition-colors">
                    <h2 className="text-2xl font-bold dark:text-white">
                        {isEditMode ? t('editProduct') : t('addNewProduct')}
                    </h2>
                    <button onClick={onCancel} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors dark:text-gray-300">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('productName')}</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('price')}</label>
                            <input
                                type="number"
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('description')}</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('stock')}</label>
                        <input
                            type="number"
                            value={stock}
                            onChange={e => setStock(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('category')}</label>
                        <select
                            value={categoryId}
                            onChange={e => setCategoryId(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-all"
                        >
                            <option value="">{t('selectCategory')}</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('mainImage')}
                                {isEditMode && <span className="text-xs text-gray-500 ml-2">({t('optional')})</span>}
                            </label>

                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer relative bg-white dark:bg-gray-700 min-h-[120px] flex flex-col items-center justify-center">
                                <input
                                    type="file"
                                    onChange={e => e.target.files && setImage(e.target.files[0])}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept="image/*"
                                    required={!isEditMode}
                                />
                                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {image ? `✓ ${image.name}` : (isEditMode ? 'Click to change image' : t('clickToUploadMain'))}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('galleryImages')}
                                {isEditMode && <span className="text-xs text-gray-500 ml-2">({t('optional')})</span>}
                            </label>
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer relative bg-white dark:bg-gray-700 min-h-[120px] flex flex-col items-center justify-center">
                                <input
                                    type="file"
                                    onChange={e => e.target.files && setGallery(Array.from(e.target.files))}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept="image/*"
                                    multiple
                                />
                                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {gallery.length > 0 ? `✓ ${gallery.length} ${t('filesSelected')}` : t('clickToUploadGallery')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-3 rounded-lg font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 transition-colors"
                        >
                            {loading
                                ? (isEditMode ? t('updating') : t('creating'))
                                : (isEditMode ? t('updateProduct') : t('createProduct'))
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminProductForm;
