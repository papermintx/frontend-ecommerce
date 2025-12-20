import { useState, useEffect } from 'react';
import { updateProduct, getProductDetail } from '../services/api';
import { X, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getImageUrl, FALLBACK_IMAGE } from '../utils/image';
import type { Product } from '../models';

interface AdminImageManagerProps {
    productId: number | string;
    onSuccess: () => void;
    onCancel: () => void;
}

const AdminImageManager = ({ productId, onSuccess, onCancel }: AdminImageManagerProps) => {
    const { t } = useLanguage();
    const [product, setProduct] = useState<Product | null>(null);
    const [newMainImage, setNewMainImage] = useState<File | null>(null);
    const [newGalleryImages, setNewGalleryImages] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductDetail(productId);
                setProduct(data);
            } catch (error) {
                console.error('Failed to fetch product', error);
            } finally {
                setLoadingProduct(false);
            }
        };
        fetchProduct();
    }, [productId]);

    // Preview main image
    useEffect(() => {
        if (!newMainImage) {
            setMainImagePreview(null);
            return;
        }

        const objectUrl = URL.createObjectURL(newMainImage);
        setMainImagePreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [newMainImage]);

    // Preview gallery images
    useEffect(() => {
        if (newGalleryImages.length === 0) {
            setGalleryPreviews([]);
            return;
        }

        const urls = newGalleryImages.map(file => URL.createObjectURL(file));
        setGalleryPreviews(urls);

        return () => urls.forEach(url => URL.revokeObjectURL(url));
    }, [newGalleryImages]);

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewMainImage(e.target.files[0]);
        }
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            if (files.length > 10) {
                alert('Maximum 10 gallery images allowed');
                return;
            }
            setNewGalleryImages(files);
        }
    };

    const handleRemoveMainImage = () => {
        setNewMainImage(null);
        setMainImagePreview(null);
    };

    const handleRemoveGalleryImage = (index: number) => {
        const newFiles = newGalleryImages.filter((_, i) => i !== index);
        setNewGalleryImages(newFiles);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMainImage && newGalleryImages.length === 0) {
            alert('Please select at least one image to update');
            return;
        }

        setLoading(true);

        const formData = new FormData();

        // Only add images that user wants to update
        if (newMainImage) {
            formData.append('image', newMainImage);
        }

        if (newGalleryImages.length > 0) {
            newGalleryImages.forEach(file => {
                formData.append('gallery', file);
            });
        }

        try {
            await updateProduct(productId, formData);
            alert('Images updated successfully! Old images have been deleted.');
            onSuccess();
        } catch (error) {
            alert('Failed to update images');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loadingProduct) {
        return (
            <div className="fixed inset-0 bg-black/50 dark:bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto"></div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="fixed inset-0 bg-black/50 dark:bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8">
                    <p className="text-gray-900 dark:text-white">Product not found</p>
                    <button onClick={onCancel} className="mt-4 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg">Close</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-colors overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl transition-colors my-8">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10 transition-colors">
                    <div>
                        <h2 className="text-2xl font-bold dark:text-white">Update Product Images</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{product.name}</p>
                    </div>
                    <button onClick={onCancel} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors dark:text-gray-300">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {/* Current Main Image */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Current Main Image</h3>
                        <div className="aspect-square max-w-xs rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                            <img
                                src={getImageUrl(product.imageUrl)}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                                }}
                            />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            ⚠️ This image will be <strong>permanently deleted</strong> if you upload a new one
                        </p>
                    </div>

                    {/* New Main Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Upload New Main Image (Optional)
                        </label>

                        {!mainImagePreview ? (
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer relative bg-white dark:bg-gray-700">
                                <input
                                    type="file"
                                    onChange={handleMainImageChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept="image/*"
                                />
                                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Click to upload new main image</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">JPG, JPEG, PNG • Auto-resize & compress</p>
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="aspect-square max-w-xs rounded-2xl overflow-hidden border-2 border-green-500">
                                    <img src={mainImagePreview} alt="New main" className="w-full h-full object-cover" />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRemoveMainImage}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <p className="text-sm text-green-600 dark:text-green-400 mt-2 font-medium">✓ New image selected</p>
                            </div>
                        )}
                    </div>

                    {/* Current Gallery */}
                    {product.galleries && product.galleries.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                Current Gallery ({product.galleries.length} images)
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {product.galleries.map((gallery: any, index: number) => (
                                    <div key={index} className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                                        <img
                                            src={getImageUrl(gallery.imageUrl)}
                                            alt={`Gallery ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                ⚠️ All gallery images will be <strong>permanently deleted</strong> if you upload new ones
                            </p>
                        </div>
                    )}

                    {/* New Gallery Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Upload New Gallery Images (Optional)
                        </label>

                        {galleryPreviews.length === 0 ? (
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer relative bg-white dark:bg-gray-700">
                                <input
                                    type="file"
                                    onChange={handleGalleryChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept="image/*"
                                    multiple
                                />
                                <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Click to upload new gallery images</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Multiple selection • Max 10 images</p>
                            </div>
                        ) : (
                            <div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    {galleryPreviews.map((preview, index) => (
                                        <div key={index} className="relative">
                                            <div className="aspect-square rounded-lg overflow-hidden border-2 border-green-500">
                                                <img src={preview} alt={`New gallery ${index + 1}`} className="w-full h-full object-cover" />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveGalleryImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                                    ✓ {galleryPreviews.length} new image{galleryPreviews.length > 1 ? 's' : ''} selected
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setNewGalleryImages([])}
                                    className="mt-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                >
                                    Clear all new gallery images
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Warning Box */}
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
                                    Important: Old images will be permanently deleted
                                </p>
                                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                                    • Main image: will be deleted if you upload a new one<br />
                                    • Gallery: ALL old gallery images will be deleted if you upload new ones
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-3 rounded-lg font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={loading || (!newMainImage && newGalleryImages.length === 0)}
                            className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                            <Upload size={20} />
                            {loading ? 'Updating Images...' : 'Update Images'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminImageManager;
