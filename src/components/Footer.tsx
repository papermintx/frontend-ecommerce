import { Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();
    return (
        <footer className="bg-gray-100 dark:bg-black text-gray-900 dark:text-white py-8 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="text-xl font-serif font-bold mb-3">StyleMart</h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-sm mb-4 text-xs transition-colors">
                            {t('elevatingStyle')}
                        </p>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-900 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                                <Instagram size={20} />
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-900 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                                <Facebook size={20} />
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-900 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                                <Twitter size={20} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4 dark:text-white">{t('shop')}</h3>
                        <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400 transition-colors">
                            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t('newArrivals')}</a></li>
                            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t('bestSellers')}</a></li>
                            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t('accessories')}</a></li>
                            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t('sale')}</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4 dark:text-white">{t('support')}</h3>
                        <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400 transition-colors">
                            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t('contactUs')}</a></li>
                            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t('faqs')}</a></li>
                            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t('shipping')}</a></li>
                            <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t('returns')}</a></li>
                            <li><Link to="/login" className="hover:text-black dark:hover:text-white transition-colors">{t('admin')}</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-900 pt-8 text-center text-gray-500 dark:text-gray-600 text-sm transition-colors">
                    {t('rightsReserved')}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
