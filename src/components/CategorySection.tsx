import { memo } from 'react';
import { Link } from 'react-router-dom';
import CarCard from './CarCard';
import type { Category, Product } from '../utils/storage';

interface CategorySectionProps {
    category: Category;
    products: Product[];
}

const CategorySection = memo(function CategorySection({ category, products }: CategorySectionProps) {
    if (products.length === 0) return null;

    const displayProducts = products.slice(0, 4);

    return (
        <section className="mt-4 lg:mt-11">
            <div className="flex items-baseline justify-between px-4 pt-6 pb-3 lg:px-0 lg:pt-0 lg:pb-4">
                <h2 className="m-0 text-lg font-extrabold tracking-[-0.02em] lg:text-[22px]">{category.name}</h2>
                <Link to={`/category/${category.id}`} className="text-[13px] font-bold text-primary lg:text-[13.5px]">
                    Бүгдийг харах →
                </Link>
            </div>

            {/* 모바일: 가로 스와이프 / 데스크탑: 4열 그리드 */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-1 lg:grid lg:grid-cols-4 lg:gap-3.5 lg:px-0 lg:overflow-visible">
                {displayProducts.map((product) => (
                    <CarCard key={product.id} product={product} variant="mini" savable={false} />
                ))}
            </div>
        </section>
    );
});

export default CategorySection;
