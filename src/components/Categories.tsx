import { memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Image from './Image';
import { type Category, getCategories } from '../utils/storage';

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
        <>
            {/* 모바일: 가로 스크롤 칩 */}
            <div className="lg:hidden mt-4 flex gap-2 overflow-x-auto no-scrollbar px-4">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        to={`/category/${category.id}`}
                        className="flex-none h-11 px-4 inline-flex items-center gap-1.5 rounded-[22px] border border-line bg-surface text-[13px] font-bold text-ink whitespace-nowrap"
                    >
                        {category.name}
                        {category.count > 0 && <span className="text-muted-faint font-semibold">{category.count}</span>}
                    </Link>
                ))}
            </div>

            {/* 데스크탑: 6열 카드 그리드 */}
            <section className="hidden lg:block mb-11">
                <div className="flex items-baseline justify-between mb-4">
                    <h2 className="m-0 text-[22px] font-extrabold tracking-[-0.02em]">Категори</h2>
                </div>
                <div className="grid grid-cols-6 gap-3">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            to={`/category/${category.id}`}
                            className="border border-line bg-surface rounded-[14px] px-3.5 py-[18px] text-left transition-colors hover:border-primary"
                        >
                            <div className="h-[46px] rounded-[9px] bg-tile mb-3 overflow-hidden">
                                {category.image && (
                                    <Image src={category.image} alt={category.name} className="w-full h-full object-cover" size="thumbnail" />
                                )}
                            </div>
                            <div className="text-[13.5px] font-bold text-ink truncate">{category.name}</div>
                            <div className="text-xs font-semibold text-muted-faint mt-[3px]">{category.count} зар</div>
                        </Link>
                    ))}
                </div>
            </section>
        </>
    );
});

export default Categories;
