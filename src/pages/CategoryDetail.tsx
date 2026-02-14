import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { getProducts, getCategories, type Product, type Category } from '../utils/storage';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'year-desc';

export default function CategoryDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [showSortMenu, setShowSortMenu] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [products, allCategories] = await Promise.all([
                    getProducts(),
                    getCategories()
                ]);

                // Find specific category
                const catId = Number(id);
                const foundCat = allCategories.find(c => c.id === catId);
                setCategory(foundCat || null);

                // Filter products by category
                const filtered = products.filter(p => p.categoryId === catId);
                setAllProducts(filtered);
            } catch (err) {
                console.error('Failed to fetch category data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const filteredAndSortedProducts = useMemo(() => {
        let result = [...allProducts];

        // Search Filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.description?.toLowerCase().includes(q)
            );
        }

        // Sorting
        result.sort((a, b) => {
            const getPrice = (p: Product) => {
                const val = p.price.replace(/[^0-9.]/g, '');
                return parseFloat(val) || 0;
            };

            switch (sortBy) {
                case 'price-asc':
                    return getPrice(a) - getPrice(b);
                case 'price-desc':
                    return getPrice(b) - getPrice(a);
                case 'year-desc':
                    return parseInt(b.year) - parseInt(a.year);
                default: // newest
                    return (b.id || 0) - (a.id || 0);
            }
        });

        return result;
    }, [allProducts, searchQuery, sortBy]);

    const getTitle = () => {
        return category ? category.name : 'Машин';
    };

    const sortOptions: { label: string; value: SortOption }[] = [
        { label: 'Сүүлийнх', value: 'newest' },
        { label: 'Үнэ: Хямдаас үнэтэй', value: 'price-asc' },
        { label: 'Үнэ: Үнэтэйгээс хямд', value: 'price-desc' },
        { label: 'Он: Шинэ нь түрүүнд', value: 'year-desc' },
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen font-display text-slate-900 dark:text-slate-100 pb-20">
            {/* Header Section */}
            <header className="sticky top-0 z-50 bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 px-4 py-3">
                <div className="flex items-center justify-between max-w-xl mx-auto">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-900 dark:text-white"
                        >
                            <span className="material-symbols-outlined block">arrow_back</span>
                        </button>
                        <h1 className="text-lg font-bold tracking-tight">{getTitle()}</h1>
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <span className="material-symbols-outlined block">search</span>
                        </button>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <span className="material-symbols-outlined block">tune</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-xl mx-auto">
                {/* Search & Quick Filters */}
                <div className="px-4 py-4">
                    <div className="relative mb-4">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                        <input
                            className="w-full bg-white dark:bg-slate-800 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary shadow-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                            placeholder="Машин хайх..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {/* Horizontal Filter Chips */}
                    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 no-scrollbar">
                        <button className="flex items-center gap-1 shrink-0 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium">
                            <span>Бүгд</span>
                        </button>
                        <button className="flex items-center gap-1 shrink-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-medium">
                            <span>Үнэ</span>
                            <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                        </button>
                        <button className="flex items-center gap-1 shrink-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-medium">
                            <span>Он</span>
                            <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                        </button>
                        <button className="flex items-center gap-1 shrink-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-medium">
                            <span>Гүйлт</span>
                            <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                        </button>
                    </div>
                </div>

                {/* Car Listings */}
                <div className="px-4 relative">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                            {loading ? 'Уншиж байна...' : `Нийт ${filteredAndSortedProducts.length} автомашин олдлоо`}
                        </p>
                        <div className="relative">
                            <button
                                onClick={() => setShowSortMenu(!showSortMenu)}
                                className="text-primary text-sm font-semibold flex items-center gap-1 p-2 hover:bg-primary/5 rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">swap_vert</span>
                                Эрэмбэлэх
                            </button>

                            {showSortMenu && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowSortMenu(false)}></div>
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50">
                                        {sortOptions.map(opt => (
                                            <button
                                                key={opt.value}
                                                onClick={() => {
                                                    setSortBy(opt.value);
                                                    setShowSortMenu(false);
                                                }}
                                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${sortBy === opt.value
                                                    ? 'bg-primary/10 text-primary font-bold'
                                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                                    }`}
                                            >
                                                {opt.label}
                                                {sortBy === opt.value && (
                                                    <span className="material-symbols-outlined text-sm">check</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : filteredAndSortedProducts.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                            {filteredAndSortedProducts.map((product) => (
                                <div
                                    key={product.id}
                                    onClick={() => navigate(`/product/${product.id}`)}
                                    className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col p-2 cursor-pointer border border-slate-100 dark:border-slate-700 active:scale-[0.98] transition-all"
                                >
                                    <div className="relative aspect-square w-full mb-2">
                                        <img
                                            alt={product.name}
                                            className="w-full h-full object-cover rounded-lg"
                                            src={product.images?.[0] || 'https://via.placeholder.com/300?text=No+Image'}
                                        />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Toggle save logic could go here
                                            }}
                                            className="absolute top-1 right-1 w-7 h-7 bg-white/80 dark:bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-700 dark:text-white"
                                        >
                                            <span className="material-symbols-outlined text-base">favorite</span>
                                        </button>
                                        <div className="absolute bottom-1 left-1 bg-primary px-1.5 py-0.5 rounded text-[9px] font-bold text-white uppercase shadow-sm">
                                            {product.status || 'Идэвхтэй'}
                                        </div>
                                    </div>
                                    <div className="px-1 flex-grow flex flex-col">
                                        <h3 className="font-bold text-[13px] leading-tight mb-0.5 text-slate-900 dark:text-white line-clamp-1">{product.name}</h3>
                                        <div className="text-[10px] text-slate-400 dark:text-slate-500 mb-1.5">
                                            <span>{product.year} он • {product.mileage}</span>
                                        </div>
                                        <span className="text-primary font-bold text-sm mt-auto">{product.price}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <span className="material-symbols-outlined text-6xl text-slate-200 dark:text-slate-700 mb-4">inventory_2</span>
                            <p className="text-slate-500 dark:text-slate-400">
                                {searchQuery ? 'Илэрц олдсонгүй' : 'Энэ ангилалд машин одоогоор байхгүй байна.'}
                            </p>
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="mt-4 text-primary font-bold text-sm"
                                >
                                    Хайлтыг цэвэрлэх
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
