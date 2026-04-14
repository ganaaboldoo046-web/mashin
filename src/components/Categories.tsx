import { useEffect, useState, memo } from 'react';
import Image from './Image';
import { type Category, getCategories } from '../utils/storage';

const Categories = memo(function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const loadCategories = async () => {
            const data = await getCategories();
            setCategories(data);
        };

        loadCategories();

        // Listen for updates from Admin panel
        window.addEventListener('storageCategories', loadCategories);
        return () => window.removeEventListener('storageCategories', loadCategories);
    }, []);

    if (categories.length === 0) return null;

    return (
        <div className="flex gap-3 overflow-x-auto no-scrollbar p-4 bg-white dark:bg-background-dark">
            {categories.map((category) => (
                <a
                    href={`/category/${category.id}`}
                    key={category.id}
                    className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm shrink-0 whitespace-nowrap active:bg-slate-50 dark:active:bg-slate-700 hover:border-primary transition-colors"
                >
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
                        {category.image ? (
                            <Image src={category.image} alt={category.name} className="w-full h-full object-cover" size="thumbnail" />
                        ) : (
                            <span className="material-symbols-outlined text-sm">{category.icon}</span>
                        )}
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{category.name}</span>
                </a>
            ))}
        </div>
    );
});

export default Categories;
