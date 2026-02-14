import { useEffect, useState } from 'react';
import { getProducts } from '../utils/storage';
import type { Product } from '../utils/storage';

export default function FeaturedListings() {
    const [cars, setCars] = useState<Product[]>([]);

    useEffect(() => {
        const loadCars = () => {
            const allProducts = getProducts();
            // Filter by isFeatured and active status
            setCars(allProducts.filter(p => p.status === 'active' && p.isFeatured));
        };

        loadCars();
        window.addEventListener('productsUpdated', loadCars);
        return () => window.removeEventListener('productsUpdated', loadCars);
    }, []);

    if (cars.length === 0) return null;

    return (
        <section className="mt-8 px-4 mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Онцлох машин</h2>
                <a href="/search?featured=true" className="text-primary text-sm font-semibold">Бүгдийг харах</a>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {cars.map((car) => (
                    <a href={`/product/${car.id}`} key={car.id} className="block bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
                        <div className="w-full h-32 relative">
                            <img className="w-full h-full object-cover" src={car.images[0]} alt={car.name} />
                            <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                FEATURED
                            </div>
                        </div>
                        <div className="p-3">
                            <h3 className="font-bold text-sm truncate">{car.name}</h3>
                            <p className="text-xs text-slate-500 mt-1">{car.year} • {car.mileage}</p>
                            <p className="text-primary font-bold mt-2">{car.price}</p>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
