import { useEffect, useState } from 'react';
import Image from './Image';
import { getProducts } from '../utils/storage';
import type { Product } from '../utils/storage';

export default function FeaturedCars() {
    const [cars, setCars] = useState<Product[]>([]);

    useEffect(() => {
        const loadCars = async () => {
            const allProducts = await getProducts();
            setCars(allProducts.filter(p => p.status === 'active'));
        };

        loadCars();
        window.addEventListener('storageProducts', loadCars);
        return () => window.removeEventListener('storageProducts', loadCars);
    }, []);

    if (cars.length === 0) return null;

    return (
        <section className="mt-4 px-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Шинэ зар</h2>
                <a href="/search" className="text-primary text-sm font-semibold">Бүгдийг харах</a>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {cars.slice(0, 6).map((car) => (
                    <a href={`/product/${car.id}`} key={car.id} className="min-w-[200px] block bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
                        <div className="w-full aspect-video relative">
                            <Image className="w-full h-full object-cover" src={car.images[0]} alt={car.name} size="thumbnail" />
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
