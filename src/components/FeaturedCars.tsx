import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CarCard from './CarCard';
import { getProducts, getSavedIds } from '../utils/storage';
import type { Product } from '../utils/storage';

/** 한 번에 2줄(2열 × 2행)씩 노출하고, 5번째부터는 더보기로 펼친다. */
const PAGE_SIZE = 4;

export default function FeaturedCars() {
    const [cars, setCars] = useState<Product[]>([]);
    const [savedIds, setSavedIds] = useState<number[]>(getSavedIds);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const loadCars = async () => {
            const all = await getProducts();
            setCars(all.filter((p) => p.status === 'active'));
            setPage(1);
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

    const totalPages = Math.ceil(cars.length / PAGE_SIZE);
    const visible = cars.slice(0, page * PAGE_SIZE);
    const hasMore = page < totalPages;

    return (
        <section className="mt-2 lg:mt-0">
            <div className="flex items-baseline justify-between px-4 pt-6 pb-3 lg:px-0 lg:pt-0 lg:pb-4">
                <h2 className="m-0 text-lg font-extrabold tracking-[-0.02em] lg:text-[22px]">Шинэ зар</h2>
                <Link to="/search" className="text-[13px] font-bold text-primary lg:text-[13.5px]">
                    Бүгдийг харах →
                </Link>
            </div>

            {/* 모바일: 2열 컴팩트 카드 / 데스크탑: 4열 */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-4 px-4 lg:hidden">
                {visible.map((car, i) => (
                    <CarCard key={car.id} product={car} variant="compact" savedIds={savedIds} priority={i < 2} />
                ))}
            </div>
            <div className="hidden lg:grid lg:grid-cols-4 lg:gap-4">
                {visible.map((car, i) => (
                    <CarCard key={car.id} product={car} savedIds={savedIds} priority={i === 0} />
                ))}
            </div>

            {hasMore && (
                <div className="px-4 pt-5 lg:px-0 lg:pt-4">
                    <button
                        onClick={() => setPage((p) => p + 1)}
                        className="w-full h-[52px] rounded-[13px] border border-line bg-surface flex items-center justify-center gap-2 text-[14.5px] font-bold text-ink"
                    >
                        Дэлгэрэнгүй харах
                        <span className="font-semibold text-muted-faint">
                            {page} / {totalPages}
                        </span>
                    </button>
                </div>
            )}
        </section>
    );
}
