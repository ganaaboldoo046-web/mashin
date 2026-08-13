import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CarCard from './CarCard';
import { getSavedIds } from '../utils/storage';
import type { Product } from '../utils/storage';

/** 한 번에 2줄(2열 × 2행)씩 노출하고, 5번째부터는 더보기로 펼친다. */
const PAGE_SIZE = 4;

interface FeaturedCarsProps {
    cars: Product[];
    loading?: boolean;
}

export default function FeaturedCars({ cars, loading = false }: FeaturedCarsProps) {
    const [savedIds, setSavedIds] = useState<number[]>(getSavedIds);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const loadSaved = () => setSavedIds(getSavedIds());

        window.addEventListener('storageSaved', loadSaved);
        return () => {
            window.removeEventListener('storageSaved', loadSaved);
        };
    }, []);

    if (loading) {
        return (
            <section className="mt-2 lg:mt-0" aria-label="Шинэ зар ачаалж байна" aria-busy="true">
                <div className="flex items-center justify-between px-4 pt-6 pb-3 lg:px-0 lg:pt-0 lg:pb-4">
                    <div className="h-6 w-24 rounded-lg bg-surface-3 animate-pulse" />
                    <div className="h-4 w-28 rounded bg-surface-3 animate-pulse" />
                </div>
                <div className="grid grid-cols-2 gap-3 px-4 lg:grid-cols-4 lg:px-0 lg:gap-4">
                    {[0, 1, 2, 3].map((item) => (
                        <div key={item} className={item > 1 ? 'hidden lg:block' : ''}>
                            <div className="aspect-square rounded-xl bg-surface-3 animate-pulse lg:aspect-[16/10]" />
                            <div className="mt-3 h-4 w-4/5 rounded bg-surface-3 animate-pulse" />
                            <div className="mt-2 h-3 w-3/5 rounded bg-surface-3 animate-pulse" />
                            <div className="mt-3 h-5 w-1/2 rounded bg-surface-3 animate-pulse" />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (cars.length === 0) return null;

    const totalPages = Math.ceil(cars.length / PAGE_SIZE);
    const currentPage = Math.min(page, totalPages);
    const visible = cars.slice(0, currentPage * PAGE_SIZE);
    const hasMore = currentPage < totalPages;

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
                            {currentPage} / {totalPages}
                        </span>
                    </button>
                </div>
            )}
        </section>
    );
}
