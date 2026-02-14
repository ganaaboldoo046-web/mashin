import { useEffect, useState } from 'react';
import Header from '../components/Header';
import SearchSection from '../components/SearchSection';
import Banner from '../components/Banner';
import Categories from '../components/Categories';
import FeaturedCars from '../components/FeaturedCars';
import NewsSection from '../components/NewsSection';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import CategorySection from '../components/CategorySection';
import { getCategories, getProducts } from '../utils/storage';
import type { Category, Product } from '../utils/storage';

export default function Home() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const loadHbData = async () => {
            const [cats, prods] = await Promise.all([
                getCategories(),
                getProducts()
            ]);
            setCategories(cats);
            setProducts(prods.filter(p => p.status === 'active' || p.status === 'pending')); // Hide sold? or keep them? Usually active.
        };

        loadHbData();
        window.addEventListener('storageProducts', loadHbData); // Listen for updates
        return () => window.removeEventListener('storageProducts', loadHbData);
    }, []);

    // Helper to get products for a category
    const getCategoryProducts = (categoryId: number) => {
        return products.filter(p => p.categoryId === categoryId);
    };

    return (
        <div className="pb-24 min-h-screen bg-background-light dark:bg-background-dark">
            <Header />
            <main>
                <SearchSection />
                <Banner />
                <Categories />

                <FeaturedCars />

                {/* Dynamically render category sections */}
                {categories.map(category => (
                    <CategorySection
                        key={category.id}
                        category={category}
                        products={getCategoryProducts(category.id)}
                    />
                ))}


                <NewsSection />
                <Footer />
            </main>
            <BottomNav />
        </div>
    );
}
