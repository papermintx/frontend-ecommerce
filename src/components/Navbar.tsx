import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../context/LanguageContext';
import { useActiveSection } from '../hooks/useActiveSection';

// We might want to accept props for auth state later
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useLanguage();
    const location = useLocation();
    const activeSection = useActiveSection(['home', 'categories']);
    
    const isHomePage = location.pathname === '/';
    
    // Helper to check if link is active
    const isActive = (section: string) => {
        if (!isHomePage) return false;
        return activeSection === section;
    };

    // Smooth scroll to section
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Handle nav click
    const handleNavClick = (e: React.MouseEvent, sectionId: string) => {
        if (isHomePage) {
            e.preventDefault();
            scrollToSection(sectionId);
            setIsOpen(false);
        }
    };

    return (
        <nav className="fixed w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">
                    <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                        <div className="w-6 h-6 bg-black dark:bg-white rounded-md flex items-center justify-center text-white dark:text-black font-bold text-xs">
                            S
                        </div>
                        <span className="font-serif text-lg font-bold tracking-tighter dark:text-white">StyleMart</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link 
                            to="/" 
                            onClick={(e) => handleNavClick(e, 'home')}
                            className={`transition-colors font-medium relative ${
                                isActive('home') 
                                    ? 'text-black dark:text-white' 
                                    : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
                            }`}
                        >
                            {t('home')}
                            {isActive('home') && (
                                <motion.div 
                                    layoutId="activeSection"
                                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-black dark:bg-white"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                        </Link>
                        <Link 
                            to="/#categories" 
                            onClick={(e) => handleNavClick(e, 'categories')}
                            className={`transition-colors font-medium relative ${
                                isActive('categories') 
                                    ? 'text-black dark:text-white' 
                                    : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
                            }`}
                        >
                            {t('categoriesTitle')}
                            {isActive('categories') && (
                                <motion.div 
                                    layoutId="activeSection"
                                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-black dark:bg-white"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                        </Link>
                        <Link 
                            to="/marketplace" 
                            className={`transition-colors font-medium ${
                                location.pathname === '/marketplace' 
                                    ? 'text-black dark:text-white' 
                                    : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'
                            }`}
                        >
                            {t('marketplace')}
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
                            <Link 
                                to="/" 
                                className={`block py-2 font-medium ${
                                    isActive('home') 
                                        ? 'text-black dark:text-white' 
                                        : 'text-gray-600 dark:text-gray-300'
                                }`}
                                onClick={(e) => handleNavClick(e, 'home')}
                            >
                                {t('home')}
                            </Link>
                            <Link 
                                to="/#categories" 
                                className={`block py-2 font-medium ${
                                    isActive('categories') 
                                        ? 'text-black dark:text-white' 
                                        : 'text-gray-600 dark:text-gray-300'
                                }`} 
                                onClick={(e) => handleNavClick(e, 'categories')}
                            >
                                {t('categoriesTitle')}
                            </Link>
                            <Link 
                                to="/marketplace" 
                                className={`block py-2 font-medium ${
                                    location.pathname === '/marketplace' 
                                        ? 'text-black dark:text-white' 
                                        : 'text-gray-600 dark:text-gray-300'
                                }`} 
                                onClick={() => setIsOpen(false)}
                            >
                                {t('marketplace')}
                            </Link>
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
