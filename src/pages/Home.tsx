import { useEffect, useState } from 'react';
import Header from '../components/Header';
import TopTicker from '../components/TopTicker';
import SearchSection from '../components/SearchSection';
import Banner from '../components/Banner';
import Categories from '../components/Categories';
import FeaturedCars from '../components/FeaturedCars';
import CustomerReviews from '../components/CustomerReviews';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import CategorySection from '../components/CategorySection';
import { getCategories, getProducts } from '../utils/storage';
import type { Category, Product } from '../utils/storage';

export default function Home() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const loadHomeData = async () => {
            const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
            setCategories(cats);
            setProducts(prods.filter((p) => p.status === 'active' || p.status === 'pending'));
        };

        loadHomeData();
        window.addEventListener('storageProducts', loadHomeData);
        return () => window.removeEventListener('storageProducts', loadHomeData);
    }, []);

    const getCategoryProducts = (categoryId: number) => products.filter((p) => p.categoryId === categoryId);

    return (
        <div className="min-h-screen bg-canvas pb-24 lg:pb-0">
            <Header />
            <TopTicker />

            <main className="lg:max-w-shell lg:mx-auto lg:px-6 lg:pt-7 lg:pb-20">
                <SearchSection />
                <Banner />
                <Categories />
                <FeaturedCars />

                {categories.map((category) => (
                    <CategorySection key={category.id} category={category} products={getCategoryProducts(category.id)} />
                ))}

                <CustomerReviews />
            </main>

            <Footer />
            <BottomNav />
        </div>
    );
}
