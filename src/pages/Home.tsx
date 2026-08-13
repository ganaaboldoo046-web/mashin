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
import { Link } from 'react-router-dom';

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
                <section
                    aria-labelledby="dt-trading-introduction"
                    className="mx-4 mt-5 rounded-2xl border border-line bg-surface px-5 py-6 lg:mx-[72px] lg:mt-0 lg:mb-10 lg:px-8 lg:py-7"
                >
                    <h1 id="dt-trading-introduction" className="m-0 text-[22px] font-extrabold tracking-[-0.025em] text-ink lg:text-[28px]">
                        DT Trading
                    </h1>
                    <p className="mt-2 mb-0 max-w-[850px] text-[13.5px] leading-[1.7] text-muted lg:text-[15px]">
                        DT Trading нь БНСУ-аас шалгагдсан автомашин хайх, захиалах, худалдан авахад тусалж, тээвэр, гааль,
                        бүртгэлийн зөвлөгөө бүхий нэгдсэн үйлчилгээ үзүүлнэ.
                    </p>
                    <p className="mt-2 mb-0 max-w-[850px] text-[12.5px] leading-[1.65] text-muted-soft lg:text-[13.5px]">
                        Google-ээр нэвтрэх мэдээллийг хэрэглэгчийг таних, хадгалсан зар, захиалга болон сэтгэгдлийг хэрэглэгчийн
                        бүртгэлтэй холбох зорилгоор ашиглана.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[12.5px] font-bold lg:text-[13px]">
                        <Link to="/about" className="text-primary hover:underline">Бидний тухай</Link>
                        <Link to="/privacy" className="text-primary hover:underline">Нууцлалын бодлого</Link>
                        <Link to="/terms" className="text-primary hover:underline">Үйлчилгээний нөхцөл</Link>
                    </div>
                </section>
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
