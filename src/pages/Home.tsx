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
import DataStatePanel from '../components/DataStatePanel';
import { getCategoriesOrThrow, getProductsOrThrow } from '../utils/storage';
import type { Category, Product } from '../utils/storage';

export default function Home() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [dataStatus, setDataStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const [retryVersion, setRetryVersion] = useState(0);

    useEffect(() => {
        let cancelled = false;
        const loadHomeData = async () => {
            setDataStatus('loading');
            try {
                const [cats, prods] = await Promise.all([getCategoriesOrThrow(), getProductsOrThrow()]);
                if (!cancelled) {
                    setCategories(cats);
                    setProducts(prods.filter((p) => p.status === 'active' || p.status === 'pending'));
                    setDataStatus('ready');
                }
            } catch {
                if (!cancelled) setDataStatus('error');
            }
        };

        loadHomeData();
        window.addEventListener('storageProducts', loadHomeData);
        return () => {
            cancelled = true;
            window.removeEventListener('storageProducts', loadHomeData);
        };
    }, [retryVersion]);

    const getCategoryProducts = (categoryId: number) => products.filter((p) => p.categoryId === categoryId);

    return (
        <div className="min-h-screen bg-canvas pb-24 lg:pb-0">
            <Header />
            <TopTicker />

            <main className="lg:max-w-shell lg:mx-auto lg:px-6 lg:pt-7 lg:pb-20">
                <SearchSection />
                {dataStatus === 'error' && (
                    <DataStatePanel
                        status="error"
                        onRetry={() => setRetryVersion((version) => version + 1)}
                        className="mx-4 mt-4 lg:mx-0"
                    />
                )}
                <Banner />
                <Categories categories={categories} loading={dataStatus === 'loading'} />
                <FeaturedCars cars={products.filter((product) => product.status === 'active')} loading={dataStatus === 'loading'} />

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
