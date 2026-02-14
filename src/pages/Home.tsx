import Header from '../components/Header';
import SearchSection from '../components/SearchSection';
import Banner from '../components/Banner';
import Categories from '../components/Categories';
import FeaturedCars from '../components/FeaturedCars';
import FeaturedListings from '../components/FeaturedListings';
import NewsSection from '../components/NewsSection';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';

export default function Home() {
    return (
        <div className="pb-24 min-h-screen bg-background-light dark:bg-background-dark">
            <Header />
            <main>
                <SearchSection />
                <Banner />
                <Categories />
                <FeaturedCars />
                <FeaturedListings />
                <NewsSection />
                <Footer />
            </main>
            <BottomNav />
        </div>
    );
}
