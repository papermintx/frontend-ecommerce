import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../context/LanguageContext';

// We might want to accept props for auth state later
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useLanguage();
    // const navigate = useNavigate();

    // const isAuthenticated = false; // Placeholder

    return (
        <nav className="fixed w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">
                    <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                        <div className="w-6 h-6 bg-black dark:bg-white rounded-md flex items-center justify-center text-white dark:text-black font-bold text-xs">
                            M
                        </div>
                        <span className="font-serif text-lg font-bold tracking-tighter dark:text-white">MODA.</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors font-medium">{t('home')}</Link>
                        <Link to="/#categories" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors font-medium">{t('categoriesTitle')}</Link>
                        <Link to="/marketplace" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors font-medium">{t('marketplace')}</Link>

                        {/* Hidden for general users, only accessible via direct /login or /admin if known */}
                        {/* Or kept as a small footer link, but for now removing prominent 'Login' to emphasize public shopping */}
                        <Link to="/login" className="bg-black dark:bg-white text-white dark:text-black px-4 py-1.5 rounded-full text-xs font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-all transform hover:scale-105">
                            {t('admin')}
                        </Link>

                        <div className="flex items-center gap-2 pl-4 border-l border-gray-200 dark:border-gray-700">
                            <LanguageToggle />
                            <ThemeToggle />
                        </div>
                    </div>

                    <div className="md:hidden flex items-center gap-4">
                        <ThemeToggle />
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 dark:text-gray-300">
                            {isOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-gray-100"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2 dark:bg-gray-900">
                            <Link to="/" className="block py-2 text-gray-600 dark:text-gray-300 font-medium" onClick={() => setIsOpen(false)}>{t('home')}</Link>
                            <Link to="/#categories" className="block py-2 text-gray-600 dark:text-gray-300 font-medium" onClick={() => setIsOpen(false)}>{t('categoriesTitle')}</Link>
                            <Link to="/marketplace" className="block py-2 text-gray-600 dark:text-gray-300 font-medium" onClick={() => setIsOpen(false)}>{t('marketplace')}</Link>
                            <Link to="/login" className="block py-2 text-gray-600 dark:text-gray-300 font-medium" onClick={() => setIsOpen(false)}>{t('login')}</Link>
                            <div className="pt-4 flex justify-start">
                                <LanguageToggle />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
