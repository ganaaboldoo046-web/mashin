import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { getProducts, getSavedIds } from '../utils/storage';
import type { Product } from '../utils/storage';

export default function Saved() {
    const [savedProducts, setSavedProducts] = useState<Product[]>([]);

    useEffect(() => {
        const loadSaved = async () => {
            const allProducts = await getProducts();
            const savedIds = getSavedIds();
            const filtered = allProducts.filter(p => savedIds.includes(p.id));
            setSavedProducts(filtered);
        };

        loadSaved();

        // Listen for updates
        window.addEventListener('storageSaved', loadSaved);
        return () => window.removeEventListener('storageSaved', loadSaved);
    }, []);

    return (
        <div className="pb-24 min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-6">Хадгалсан</h1>

                {savedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {savedProducts.map((car) => (
                            <Link to={`/product/${car.id}`} key={car.id} className="bg-white dark:bg-slate-800 rounded-2xl p-3 shadow-sm border border-slate-100 dark:border-slate-700 flex gap-4 relative group">
                                <div className="w-32 h-24 rounded-xl overflow-hidden shrink-0">
                                    <img src={car.images[0]} alt={car.name} className="w-full h-full object-cover" />
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
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center text-slate-500">
                        <span className="material-symbols-outlined text-6xl mb-4 text-slate-300">bookmark_border</span>
                        <p className="font-medium mb-1">Одоогоор хадгалсан зар байхгүй байна.</p>
                        <p className="text-sm">Та таалагдсан зараа хадгалаад дуртай үедээ үзэх боломжтой.</p>
                        <Link to="/search" className="mt-8 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30">
                            Зар хайх
                        </Link>
                    </div>
                )}
            </div>
            <BottomNav />
        </div>
    );
}
