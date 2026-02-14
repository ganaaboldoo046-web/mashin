import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import SearchSection from '../components/SearchSection';
import BottomNav from '../components/BottomNav';
import { getProducts, getCategories, toggleSaved, getSavedIds } from '../utils/storage';
import type { Product } from '../utils/storage';

export default function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState<Product[]>([]);

    const [savedIds, setSavedIds] = useState<number[]>([]);

    useEffect(() => {
        const loadSaved = () => {
            setSavedIds(getSavedIds());
        };

        loadSaved();
        window.addEventListener('storageSaved', loadSaved);
        return () => window.removeEventListener('storageSaved', loadSaved);
    }, []);

    useEffect(() => {
        const allProducts = getProducts();
        if (query) {
            const lowerQuery = query.toLowerCase();
            const filtered = allProducts.filter(car =>
                car.name.toLowerCase().includes(lowerQuery) ||
                car.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
                car.fuel.toLowerCase().includes(lowerQuery)
            );
            setResults(filtered);
        } else {
            setResults([]);
        }
    }, [query]);

    return (
        <div className="pb-24 min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
            <Header />
            <SearchSection />

            <div className="px-4 py-4">
                <h1 className="text-xl font-bold mb-4">Хайлтын илэрц: "{query}"</h1>

                {results.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {results.map((car) => (
                            <Link to={`/product/${car.id}`} key={car.id} className="bg-white dark:bg-slate-800 rounded-2xl p-3 shadow-sm border border-slate-100 dark:border-slate-700 flex gap-4">
                                <div className="w-32 h-24 rounded-xl overflow-hidden shrink-0 relative">
                                    <img src={car.images[0]} alt={car.name} className="w-full h-full object-cover" />
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleSaved(car.id);
                                        }}
                                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white"
                                    >
                                        <span className={`material-symbols-outlined text-sm ${savedIds.includes(car.id) ? 'text-red-500 fill-current' : ''}`}>
                                            {savedIds.includes(car.id) ? 'favorite' : 'favorite_border'}
                                        </span>
                                    </button>
                                </div>
                                <div className="flex flex-col justify-between flex-1 py-1">
                                    <div>
                                        <h3 className="font-bold text-base">{car.name}</h3>
                                        <div className="flex gap-2 text-xs text-slate-500 mt-1">
                                            <span>{car.year}</span>
                                            <span>•</span>
                                            <span>{car.mileage}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-primary font-bold">{car.price}</span>
                                        <div className="flex gap-1">
                                            {car.tags.slice(0, 1).map((tag, idx) => (
                                                <span key={idx} className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-8">
                        {!query && (
                            <>
                                <h2 className="text-lg font-bold mb-4 px-2">Категори сонгох</h2>
                                <div className="flex flex-wrap gap-3">
                                    {getCategories().map((category) => (
                                        <Link
                                            to={`/category/${category.id}`}
                                            key={category.id}
                                            className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm whitespace-nowrap active:bg-slate-50 dark:active:bg-slate-700 hover:border-primary transition-colors"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
                                                {category.image ? (
                                                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="material-symbols-outlined text-sm">{category.icon}</span>
                                                )}
                                            </div>
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{category.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}
                        <div className="text-center py-20 text-slate-500">
                            {query ? (
                                <>
                                    <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                                    <p>Илэрц олдсонгүй</p>
                                </>
                            ) : null}
                        </div>
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
}
