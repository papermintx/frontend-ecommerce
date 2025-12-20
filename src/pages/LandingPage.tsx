import Hero from '../components/Hero';
import CategoryShowcase from '../components/CategoryShowcase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LandingPage = () => {
    return (
        <div className="min-h-screen font-sans bg-white selection:bg-orange-100 selection:text-orange-900">
            <Navbar />
            <main>
                <Hero />
                <CategoryShowcase />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
