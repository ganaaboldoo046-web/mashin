import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import TopTicker from '../components/TopTicker';
import BottomNav from '../components/BottomNav';
import CarCard from '../components/CarCard';
import Footer from '../components/Footer';
import { getCategories, getProducts, getSavedIds, type Category, type Product } from '../utils/storage';
import { removeJsonLd, setCanonical, setJsonLd, setMeta } from '../utils/seo';

const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://dt-trading.kr').replace(/\/$/, '');

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'year-desc';

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
    { label: 'Санал болгох', value: 'newest' },
    { label: 'Үнэ: хямдаас', value: 'price-asc' },
    { label: 'Үнэ: үнэтэйгээс', value: 'price-desc' },
    { label: 'Он: шинэ нь', value: 'year-desc' },
];

const priceValue = (price: string) => {
    const n = parseFloat(price.replace(/[^0-9.]/g, ''));
    if (Number.isNaN(n)) return 0;
    return price.includes('сая') ? n * 1_000_000 : n;
};

export default function CategoryDetail() {
    const { id } = useParams();
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [savedIds, setSavedIds] = useState<number[]>(getSavedIds);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [products, allCategories] = await Promise.all([getProducts(), getCategories()]);
                const catId = Number(id);
                setCategory(allCategories.find((c) => c.id === catId) || null);
                setAllProducts(products.filter((p) => p.categoryId === catId));
            } catch (err) {
                console.error('Failed to fetch category data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const loadSaved = () => setSavedIds(getSavedIds());
        window.addEventListener('storageSaved', loadSaved);
        return () => window.removeEventListener('storageSaved', loadSaved);
    }, []);

    useEffect(() => {
        if (loading) return;
        if (!category) {
            setMeta('meta[name="robots"]', { name: 'robots', content: 'noindex, follow' });
            return;
        }

        const title = `${category.name} автомашин | DT Trading`;
        const description = `${category.name} ангиллын Солонгосоос шалгагдсан автомашинууд. Үнэ, он, гүйлтээр харьцуулж захиалаарай.`;
        const canonicalUrl = `${SITE_URL}/category/${category.id}`;
        document.title = title;
        setMeta('meta[name="description"]', { name: 'description', content: description });
        setMeta('meta[name="robots"]', { name: 'robots', content: 'index, follow' });
        setMeta('meta[property="og:title"]', { property: 'og:title', content: title });
        setMeta('meta[property="og:description"]', { property: 'og:description', content: description });
        setMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
        setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
        setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
        setCanonical(canonicalUrl);
        setJsonLd('category-breadcrumbs', {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Нүүр', item: `${SITE_URL}/` },
                { '@type': 'ListItem', position: 2, name: category.name, item: canonicalUrl },
            ],
        });

        return () => removeJsonLd('category-breadcrumbs');
    }, [category, loading]);

    const products = useMemo(() => {
        let result = [...allProducts];

        const q = searchQuery.trim().toLowerCase();
        if (q) {
            result = result.filter((p) => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
        }

        result.sort((a, b) => {
            switch (sortBy) {
                case 'price-asc':
                    return priceValue(a.price) - priceValue(b.price);
                case 'price-desc':
                    return priceValue(b.price) - priceValue(a.price);
                case 'year-desc':
                    return parseInt(b.year) - parseInt(a.year);
                default:
                    return (b.id || 0) - (a.id || 0);
            }
        });

        return result;
    }, [allProducts, searchQuery, sortBy]);

    return (
        <div className="min-h-screen bg-canvas pb-24 lg:pb-0">
            <Header showBack title={category?.name || 'Автомашин'} />
            <TopTicker />

            <main className="lg:max-w-shell lg:mx-auto lg:px-6 lg:pt-8 lg:pb-20">
                <div className="hidden lg:block mb-7">
                    <h1 className="m-0 mb-1.5 text-[30px] font-extrabold tracking-[-0.03em]">{category?.name || 'Автомашин'}</h1>
                    <p className="m-0 text-[14.5px] text-muted">Нийт {allProducts.length} зар.</p>
                </div>

                <div className="px-4 pt-4 lg:px-0 lg:pt-0">
                    <div className="flex items-center gap-2.5 h-12 px-3.5 rounded-[14px] bg-surface border border-line lg:h-11 lg:max-w-[420px]">
                        <span className="text-muted-faint text-base leading-none">⌕</span>
                        <input
                            className="flex-1 min-w-0 border-0 outline-none bg-transparent text-sm font-medium text-ink placeholder:text-muted-faint"
                            placeholder="Энэ ангилалд хайх"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} aria-label="Цэвэрлэх" className="text-muted-faint text-sm leading-none">
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pt-3 lg:px-0 lg:pt-4 lg:flex-wrap lg:overflow-visible">
                    {SORT_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setSortBy(option.value)}
                            className={`flex-none h-10 px-[15px] rounded-[20px] border text-[13px] whitespace-nowrap lg:h-9 lg:rounded-[9px] ${
                                sortBy === option.value
                                    ? 'border-primary bg-primary-soft text-primary font-bold'
                                    : 'border-line-strong bg-surface text-ink-soft font-semibold'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center justify-between px-4 pt-4 pb-3.5 lg:px-0">
                    <div className="text-[13.5px] font-bold lg:text-sm">
                        {loading ? 'Уншиж байна…' : `${products.length} машин`}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 rounded-full border-4 border-line border-t-primary animate-spin" />
                    </div>
                ) : products.length > 0 ? (
                    <div className="flex flex-col gap-3 px-4 lg:grid lg:grid-cols-4 lg:gap-4 lg:px-0">
                        {products.map((product, i) => (
                            <CarCard key={product.id} product={product} savedIds={savedIds} priority={i === 0} />
                        ))}
                    </div>
                ) : (
                    <div className="mx-4 bg-surface border border-line rounded-2xl px-5 py-14 text-center lg:mx-0">
                        <div className="text-[15px] font-extrabold">
                            {searchQuery ? 'Тохирох зар олдсонгүй' : 'Энэ ангилалд зар алга'}
                        </div>
                        <div className="mt-1.5 text-[13px] text-muted">Өөр ангилал эсвэл хайлт оролдоно уу.</div>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="mt-4 h-11 px-5 rounded-[11px] bg-primary text-white text-[13.5px] font-bold"
                            >
                                Хайлт цэвэрлэх
                            </button>
                        )}
                    </div>
                )}
            </main>

            <div className="hidden lg:block">
                <Footer />
            </div>
            <BottomNav />
        </div>
    );
}
