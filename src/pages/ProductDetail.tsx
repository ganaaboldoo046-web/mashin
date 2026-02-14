import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { getProducts, addToRecentlyViewed } from '../utils/storage';
import type { Product } from '../utils/storage';

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const [activeImage, setActiveImage] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Scroll to top when component mounts or id changes
        window.scrollTo(0, 0);

        const loadData = async () => {
            if (id) {
                const products = await getProducts();
                const found = products.find(p => p.id === Number(id));
                setProduct(found || null);

                if (found) {
                    // Add to recently viewed
                    addToRecentlyViewed(found.id);

                    // Find similar products: same category, not current product
                    const similar = products
                        .filter(p => p.categoryId === found.categoryId && p.id !== found.id)
                        .slice(0, 5); // Limit to 5 items
                    setSimilarProducts(similar);
                }
            }
            setLoading(false);
        };

        loadData();
    }, [id]);

    if (loading) return <div className="h-screen flex items-center justify-center bg-white dark:bg-background-dark text-slate-500">Loading...</div>;

    if (!product) return (
        <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-background-dark text-slate-500 gap-4">
            <span className="material-symbols-outlined text-4xl">error</span>
            <p>Бүтээгдэхүүн олдсонгүй</p>
            <button onClick={() => navigate('/')} className="text-primary font-bold">Нүүр хуудас руу буцах</button>
        </div>
    );

    return (
        <div className="h-screen flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-white overflow-hidden">
            {/* Header stays fixed at top */}
            <div className="flex-none z-50">
                <Header />
            </div>

            {/* Scrollable Content Area */}
            <main className="flex-1 overflow-y-auto pb-32 scroll-smooth">
                {/* Image Gallery */}
                <div className="relative w-full aspect-[4/3] bg-black">
                    {product.images && product.images.length > 0 ? (
                        <img
                            src={product.images[activeImage]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-200 dark:bg-slate-800">
                            <span className="material-symbols-outlined text-4xl">image_not_supported</span>
                        </div>
                    )}

                    {/* Image Navigation Dots */}
                    {product.images && product.images.length > 1 && (
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                            {product.images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`w-2 h-2 rounded-full transition-all ${idx === activeImage ? 'bg-white w-4' : 'bg-white/50'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="px-4 py-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-2xl font-bold mb-1">{product.name}</h1>
                            <p className="text-slate-500">{product.year} • {product.mileage}</p>
                        </div>
                        <div className="flex flex-col items-end text-right">
                            <span className="text-primary text-xl font-bold">{product.price}</span>
                            <span className="text-[10px] text-slate-400 font-medium">Монголд очих үнэ</span>
                            {product.priceKRW && (
                                <span className="text-xs text-slate-400 mt-0.5">
                                    ({product.priceKRW.toLocaleString()} KRW)
                                </span>
                            )}
                            <span className={`text-xs px-2 py-1 rounded-full mt-2 ${product.status === 'active' ? 'bg-green-100 text-green-700' :
                                product.status === 'sold' ? 'bg-red-100 text-red-700' :
                                    product.status === 'discounted' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                {product.status === 'active' ? 'Бэлэн' : product.status === 'sold' ? 'Зарагдсан' : product.status === 'discounted' ? 'Хямдарсан' : 'Хүлээгдэж буй'}
                            </span>
                        </div>
                    </div>

                    {/* Quick Specs / Detailed Specs Grid */}
                    <div className="mb-8">
                        <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Дэлгэрэнгүй үзүүлэлт</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <SpecItem icon="calendar_today" label="Үйлдвэрлэсэн он" value={product.year} />
                            <SpecItem icon="speed" label="Явсан" value={product.mileage} />
                            <SpecItem icon="local_gas_station" label="Түлш" value={
                                product.fuel === 'Petrol' ? 'Бензин' :
                                    product.fuel === 'Diesel' ? 'Дизель' :
                                        product.fuel === 'Hybrid' ? 'Хайбрид' :
                                            product.fuel === 'Electric' ? 'Цахилгаан' :
                                                product.fuel === 'Gas' ? 'Газ' : product.fuel
                            } />
                            <SpecItem icon="settings" label="Хөдөлгүүр" value={product.engine || "-"} />
                            <SpecItem icon="settings_input_component" label="Хурдны хайрцаг" value={product.transmission || "-"} />
                            <SpecItem icon="architecture" label="Хөтлөгч" value={product.drive || "-"} />
                            <SpecItem icon="palette" label="Өнгө" value={product.color || "-"} />
                            <SpecItem icon="format_paint" label="Дотор өнгө" value={product.interiorColor || "-"} />
                            <SpecItem icon="sensor_door" label="Хаалга" value={product.doors || "-"} />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                        <h2 className="font-bold text-lg mb-3">Тайлбар</h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {product.description || "Тайлбар байхгүй байна."}
                        </p>
                    </div>

                    {/* Similar Products */}
                    {similarProducts.length > 0 && (
                        <div className="mb-4">
                            <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Төстэй зар</h3>
                            <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide">
                                {similarProducts.map(item => (
                                    <div
                                        key={item.id}
                                        onClick={() => navigate(`/product/${item.id}`)}
                                        className="min-w-[160px] w-[160px] bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 shrink-0 active:scale-95 transition-transform"
                                    >
                                        <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-700 relative">
                                            <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                                            {item.status !== 'active' && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold px-2 py-1 bg-black/50 rounded-lg backdrop-blur-sm">
                                                        {item.status === 'sold' ? 'Зарагдсан' : 'Хүлээгдэж буй'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate mb-1">{item.name}</h4>
                                            <p className="text-primary font-bold text-sm mb-1">{item.price}</p>
                                            <p className="text-[10px] text-slate-400">{item.year} • {item.mileage}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Action Bar & Bottom Nav - Fixed at bottom */}
            <div className="flex-none z-40 relative">
                {/* Floating Action Bar */}
                <div className="absolute bottom-[72px] left-0 right-0 px-4 pointer-events-none">
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-2 flex gap-2 items-center max-w-md mx-auto pointer-events-auto">
                        <button className="flex-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-bold h-12 rounded-xl shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700">
                            <span className="material-symbols-outlined">call</span>
                            Холбоо барих
                        </button>
                        <button className="flex-1 bg-primary text-white font-bold h-12 rounded-xl shadow-md shadow-primary/20 active:scale-95 transition-transform flex items-center justify-center gap-2 hover:bg-blue-600">
                            <span className="material-symbols-outlined">shopping_cart</span>
                            Захиалах
                        </button>
                    </div>
                </div>

                <BottomNav />
            </div>
        </div>
    );
}

function SpecItem({ icon, label, value }: { icon: string, label: string, value: string }) {
    if (!value || value === '-') return null; // Don't show if empty

    return (
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 flex items-center gap-3 border border-slate-100 dark:border-slate-700/50">
            <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-primary shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-xl">{icon}</span>
            </div>
            <div className="min-w-0">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide leading-tight mb-0.5">{label}</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{value}</p>
            </div>
        </div>
    );
}
