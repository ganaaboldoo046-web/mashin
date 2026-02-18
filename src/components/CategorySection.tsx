import { Link } from 'react-router-dom';
import type { Category, Product } from '../utils/storage';

interface CategorySectionProps {
    category: Category;
    products: Product[];
}

export default function CategorySection({ category, products }: CategorySectionProps) {
    if (products.length === 0) return null;

    const displayProducts = products.slice(0, 6);
    const showViewAll = products.length > 6;

    return (
        <section className="mt-8 px-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {category.name}
                </h2>
                <Link
                    to={`/category/${category.id}`}
                    className="text-primary text-sm font-semibold hover:opacity-80 transition-opacity flex items-center gap-1"
                >
                    <span>Бүгдийг харах</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 snap-x">
                {displayProducts.map((product) => (
                    <Link
                        to={`/product/${product.id}`}
                        key={product.id}
                        className="min-w-[200px] w-[200px] block bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 snap-start"
                    >
                        <div className="w-full h-32 relative group">
                            <img
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                src={product.images[0]}
                                alt={product.name}
                            />
                            {product.status === 'sold' && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="text-white font-bold text-sm px-3 py-1 bg-red-500 rounded-full">Зарагдсан</span>
                                </div>
                            )}
                        </div>
                        <div className="p-3">
                            <h3 className="font-bold text-sm truncate text-slate-900 dark:text-white">{product.name}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{product.year} • {product.mileage}</p>
                            <p className="text-primary font-bold mt-2">{product.price}</p>
                        </div>
                    </Link>
                ))}

                {/* Optional: 'View All' Card as the 7th item if we wanted to be fancy, but standard link is safer/cleaner. 
                    The user requirement "7 items... click View All" is handled by the header link for now.
                */}
            </div>
        </section>
    );
}
