import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CarCard from './CarCard';
import { getProducts, getSavedIds } from '../utils/storage';
import type { Product } from '../utils/storage';

export default function FeaturedCars() {
    const [cars, setCars] = useState<Product[]>([]);
    const [savedIds, setSavedIds] = useState<number[]>(getSavedIds);

    useEffect(() => {
        const loadCars = async () => {
            const all = await getProducts();
            setCars(all.filter((p) => p.status === 'active').slice(0, 4));
        };
        const loadSaved = () => setSavedIds(getSavedIds());

        loadCars();
        window.addEventListener('storageProducts', loadCars);
        window.addEventListener('storageSaved', loadSaved);
        return () => {
            window.removeEventListener('storageProducts', loadCars);
            window.removeEventListener('storageSaved', loadSaved);
        };
    }, []);

    if (cars.length === 0) return null;

    return (
        <section className="mt-2 lg:mt-0">
            <div className="flex items-baseline justify-between px-4 pt-6 pb-3 lg:px-0 lg:pt-0 lg:pb-4">
                <h2 className="m-0 text-lg font-extrabold tracking-[-0.02em] lg:text-[22px]">Шинэ зар</h2>
                <Link to="/search" className="text-[13px] font-bold text-primary lg:text-[13.5px]">
                    Бүгдийг харах →
                </Link>
            </div>
            <div className="flex flex-col gap-3 px-4 lg:grid lg:grid-cols-4 lg:gap-4 lg:px-0">
                {cars.map((car, i) => (
                    <CarCard key={car.id} product={car} savedIds={savedIds} priority={i === 0} />
                ))}
            </div>
        </section>
    );
}
