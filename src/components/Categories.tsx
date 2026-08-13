import { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Image from './Image';
import { type Category, getCategories } from '../utils/storage';

/** 로고 이미지가 없는 카테고리는 아이콘, 그마저 없으면 머리글자로 대체한다. */
function CategoryMark({ category }: { category: Category }) {
    if (category.image) {
        return (
            <Image
                src={category.image}
                alt={category.name}
                className="w-7 h-7 lg:w-8 lg:h-8 object-contain shrink-0"
                size="thumbnail"
            />
        );
    }

    if (category.icon) {
        return (
            <span className="material-symbols-outlined text-[22px] lg:text-2xl text-muted-faint shrink-0">
                {category.icon}
            </span>
        );
    }

    return (
        <span className="w-7 h-7 lg:w-8 lg:h-8 shrink-0 rounded-full bg-surface-4 text-muted-strong text-xs font-extrabold flex items-center justify-center">
            {category.name.slice(0, 1).toUpperCase()}
        </span>
    );
}

const Categories = memo(function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const load = async () => setCategories(await getCategories());
        load();
        window.addEventListener('storageCategories', load);
        return () => window.removeEventListener('storageCategories', load);
    }, []);

    if (categories.length === 0) return null;

    return (
        <section className="mt-4 lg:mt-0 lg:mb-11">
            <div className="hidden lg:flex items-baseline justify-between mb-4">
                <h2 className="m-0 text-[22px] font-extrabold tracking-[-0.02em]">Категори</h2>
            </div>

            {/* 모바일은 가로 스크롤, 데스크탑은 줄바꿈 — 칩 자체는 동일 */}
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar px-4 lg:flex-wrap lg:overflow-visible lg:px-0 lg:gap-3">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        to={`/category/${category.id}`}
                        className="flex-none inline-flex items-center gap-2.5 h-12 px-4 lg:h-[52px] lg:px-5 rounded-full border border-line bg-surface text-ink hover:text-ink hover:border-line-2 transition-colors"
                    >
                        <CategoryMark category={category} />
                        <span className="text-[13.5px] lg:text-[14.5px] font-bold whitespace-nowrap">{category.name}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
});

export default Categories;
