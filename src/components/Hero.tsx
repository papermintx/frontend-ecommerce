import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

import { useLanguage } from '../context/LanguageContext';

const Hero = () => {
    const { t } = useLanguage();
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    return (
        <section id="home" ref={ref} className="relative pt-20 pb-12 lg:pt-24 lg:pb-16 overflow-hidden bg-[#fafafa] dark:bg-gray-900 min-h-[70vh] flex items-center transition-colors duration-300">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-100 to-transparent dark:from-gray-800 -z-0 pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    <motion.div
                        style={{ y: yText }}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="overflow-hidden mb-4">
                            <motion.span
                                variants={{
                                    hidden: { y: "100%" },
                                    visible: { y: 0, transition: { duration: 0.6, ease: "circOut" } }
                                }}
                                className="text-sm font-bold tracking-widest text-gray-500 uppercase block"
                            >
                                New Collection 2025
                            </motion.span>
                        </div>

                        <h1 className="text-5xl lg:text-6xl font-serif font-bold leading-[0.9] mb-6 text-gray-900 dark:text-white transition-colors">
                            <div className="overflow-hidden">
                                <motion.div
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.1, ease: "circOut" }}
                                >
                                    Welcome to
                                </motion.div>
                            </div>
                            <div className="overflow-hidden">
                                <motion.div
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2, ease: "circOut" }}
                                    className="flex items-center gap-4"
                                >
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-200 dark:to-gray-400 italic font-light">MODA.</span> Store
                                </motion.div>
                            </div>
                        </h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-base text-gray-600 dark:text-gray-300 mb-6 max-w-lg leading-relaxed transition-colors"
                        >
                            Experience the perfect blend of contemporary aesthetics and everyday comfort. Fashion that speaks volumes without saying a word.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Link to="/marketplace" className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-black/10 hover:shadow-2xl hover:-translate-y-1 text-sm">
                                {t('shopNow')} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a href="#categories" className="px-6 py-2.5 bg-white dark:bg-transparent text-black dark:text-white border-2 border-gray-100 dark:border-white rounded-full font-bold hover:border-black dark:hover:bg-white/10 transition-all flex items-center justify-center hover:-translate-y-1 text-sm">
                                {t('learnMore')}
                            </a>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        style={{ y: yImage }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop&q=80"
                                alt="Fashion Model"
                                className="object-cover w-full h-full hover:scale-105 transition-transform duration-[1.5s]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent mix-blend-multiply opacity-60"></div>
                        </div>

                        {/* Floating Element - Glassmorphism */}
                        <motion.div
                            animate={{ y: [-15, 15, -15] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            className="absolute top-12 -left-12 bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl max-w-[200px]"
                        >
                            <div className="text-4xl font-serif font-bold">100%</div>
                            <div className="text-sm font-medium text-gray-600">Premium Quality Cotton</div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
