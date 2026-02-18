import { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';
import { useParams, useNavigate } from 'react-router-dom';
// import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { getProducts, addToRecentlyViewed, isSaved, toggleSaved } from '../utils/storage';
import type { Product } from '../utils/storage';
import { VEHICLE_OPTIONS } from '../constants/vehicleOptions';

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const [activeImage, setActiveImage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isProductSaved, setIsProductSaved] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Scroll to top when component mounts or id changes
        window.scrollTo(0, 0);

        // Check user login status
        const storedUser = localStorage.getItem('somang_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const loadData = async () => {
            if (id) {
                const products = await getProducts();
                const found = products.find(p => p.id === Number(id));
                setProduct(found || null);

                if (found) {
                    // Check saved status
                    setIsProductSaved(isSaved(found.id));

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

    const handleBack = () => {
        navigate(-1);
    };

    const handleShare = async () => {
        if (!user) {
            alert('Гүүгл хаягаар нэвтэрч байж хуваалцана уу.');
            return;
        }

        const shareData = {
            title: product?.name || 'TEMMUN TRADING',
            text: `Check out this car: ${product?.name}`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert('Линк хуулагдлаа!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    const handleToggleSave = () => {
        if (!user) {
            alert('Гүүгл хаягаар нэвтэрч байж хадгална уу.');
            return;
        }
        if (product) {
            const newState = toggleSaved(product.id);
            // toggleSaved returns: true (if ADDED means newly saved - index was -1), false (if REMOVED)
            // Implementation: const newSaved = index === -1 ? ... : ...; return index === -1;
            // So if it returns true, it's now saved.
            setIsProductSaved(newState);
        }
    };


    const [isCallModalOpen, setIsCallModalOpen] = useState(false);
    const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
    const [reservationForm, setReservationForm] = useState({
        userName: '',
        phone: '',
        facebookId: ''
    });
    const [reservationStatus, setReservationStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleReservationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setReservationStatus('submitting');

        try {
            const response = await fetch('/api/reservations_create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: product?.id,
                    productName: product?.name,
                    userId: user?.email, // Send email as userId if logged in
                    ...reservationForm
                })
            });

            if (response.ok) {
                // --- EmailJS Integration Start ---
                try {
                    // NOTE: Replace these with your actual EmailJS keys
                    const SERVICE_ID = 'YOUR_SERVICE_ID';
                    const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
                    const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

                    const templateParams = {
                        product_name: product?.name,
                        product_price: product?.price,
                        user_name: reservationForm.userName,
                        user_phone: reservationForm.phone,
                        user_facebook: reservationForm.facebookId,
                        user_email: user?.email || 'Guest',
                        date: new Date().toLocaleString()
                    };

                    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
                    console.log('Email sent successfully');
                } catch (emailError) {
                    console.error('Failed to send email:', emailError);
                    // We don't block the success state even if email fails
                }
                // --- EmailJS Integration End ---

                setReservationStatus('success');
                setTimeout(() => {
                    setIsReservationModalOpen(false);
                    setReservationStatus('idle');
                    setReservationForm({ userName: '', phone: '', facebookId: '' });
                }, 2000);
            } else {
                setReservationStatus('error');
            }
        } catch (error) {
            setReservationStatus('error');
        }
    };

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
            {/* Custom Header for Product Detail */}
            <div className="flex-none z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined">arrow_back_ios_new</span>
                    </button>
                    {/* Removed product.name title */}
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleToggleSave}
                        className={`p-2 rounded-full transition-all active:scale-95 ${isProductSaved
                            ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                    >
                        <span className={`material-symbols-outlined ${isProductSaved ? 'fill-current material-icons' : ''}`}>
                            {/* fill-current class on symbol might not work for filled variant. 
                                Material Symbols usually use 'fill' setting or a filled font. 
                                Or simply 'favorite' vs 'favorite_border'. 
                                I'll use text content switching. */}
                            {isProductSaved ? 'favorite' : 'favorite_border'}
                        </span>
                    </button>
                    <button
                        onClick={handleShare}
                        className="p-2 rounded-full text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95"
                    >
                        <span className="material-symbols-outlined">share</span>
                    </button>
                </div>
            </div>

            {/* Scrollable Content Area */}
            <main className="flex-1 overflow-y-auto pb-32 scroll-smooth">
                {/* Image Gallery */}
                <div className="relative w-full aspect-[4/3] bg-black group">
                    <div
                        id="image-gallery-container"
                        className="w-full h-full overflow-x-auto snap-x snap-mandatory flex scrollbar-hide"
                        onScroll={(e) => {
                            const container = e.currentTarget;
                            const scrollPosition = container.scrollLeft;
                            const width = container.clientWidth;
                            const newIndex = Math.round(scrollPosition / width);
                            setActiveImage(newIndex);
                        }}
                    >
                        {product.images && product.images.length > 0 ? (
                            product.images.map((img, idx) => (
                                <div key={idx} className="w-full h-full flex-shrink-0 snap-center relative">
                                    <img
                                        src={img}
                                        alt={`${product.name} - ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-200 dark:bg-slate-800 flex-shrink-0 snap-center">
                                <span className="material-symbols-outlined text-4xl">image_not_supported</span>
                            </div>
                        )}
                    </div>

                    {/* Image Navigation Dots */}
                    {product.images && product.images.length > 1 && (
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                            {product.images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const container = document.getElementById('image-gallery-container');
                                        if (container) {
                                            container.scrollTo({
                                                left: container.clientWidth * idx,
                                                behavior: 'smooth'
                                            });
                                        }
                                    }}
                                    className={`w-2 h-2 rounded-full transition-all shadow-sm ${idx === activeImage ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'
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

                    {/* Vehicle Options */}
                    {product.options && product.options.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Нэмэлт тоноглол</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {product.options.map(optId => {
                                    const opt = VEHICLE_OPTIONS.find(o => o.id === optId);
                                    if (!opt) return null;
                                    return (
                                        <div key={opt.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50">
                                            <span className="material-symbols-outlined text-primary text-xl">{opt.icon}</span>
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{opt.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

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
                <div className="fixed bottom-[80px] left-0 right-0 px-4 pointer-events-none z-50">
                    {/* Chat Floating Button */}
                    <button
                        onClick={() => window.open('https://www.facebook.com/temmun.trading', '_blank')}
                        className="absolute bottom-[70px] right-4 bg-primary text-white h-10 px-4 rounded-full shadow-lg flex items-center justify-center gap-2 z-50 pointer-events-auto active:scale-95 transition-transform animate-bounce-slow"
                    >
                        <span className="material-symbols-outlined text-xl">chat</span>
                        <span className="font-bold whitespace-nowrap text-sm">ЧАТ БИЧИХ</span>
                        <span className="absolute -top-1 -right-1 bg-red-600 text-[10px] text-white font-bold px-1.5 py-0.5 rounded-full border border-white">1</span>
                    </button>

                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-2 flex gap-2 items-center max-w-md mx-auto pointer-events-auto">
                        <button onClick={() => setIsCallModalOpen(true)} className="flex-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-bold h-12 rounded-xl shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700">
                            <span className="material-symbols-outlined">call</span>
                            Залгах
                        </button>
                        <button onClick={() => setIsReservationModalOpen(true)} className="flex-1 bg-primary text-white font-bold h-12 rounded-xl shadow-md shadow-primary/20 active:scale-95 transition-transform flex items-center justify-center gap-2 hover:bg-blue-600">
                            <span className="material-symbols-outlined">shopping_cart</span>
                            Захиалах
                        </button>
                    </div>
                </div>

                <BottomNav />
            </div>

            {/* Call Selection Modal */}
            {isCallModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setIsCallModalOpen(false)}>
                    <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Холбогдох дугаар</h3>
                                <button onClick={() => setIsCallModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="space-y-3">
                                <a href="tel:01057279927" className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-100 dark:border-slate-700">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined">call</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 font-medium">Солонгос дугаар</p>
                                        <p className="text-lg font-bold text-slate-900 dark:text-white">010 5727 9927</p>
                                    </div>
                                </a>

                                <a href="tel:99001979" className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-100 dark:border-slate-700">
                                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined">call</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 font-medium">Монгол дугаар</p>
                                        <p className="text-lg font-bold text-slate-900 dark:text-white">9900 1979</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reservation Modal */}
            {isReservationModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Машин захиалах</h3>
                                <button onClick={() => setIsReservationModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            {reservationStatus === 'success' ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="material-symbols-outlined text-3xl">check</span>
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Захиалга амжилттай!</h4>
                                    <p className="text-slate-500 text-sm mb-6">Бид тантай удахгүй холбогдох болно.</p>

                                    <button
                                        onClick={() => navigate('/profile')}
                                        className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold py-3 rounded-xl mb-3 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        Миний захиалга харах
                                    </button>
                                    <button
                                        onClick={() => setIsReservationModalOpen(false)}
                                        className="text-slate-400 text-sm font-medium hover:text-slate-600"
                                    >
                                        Хаах
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleReservationSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Нэр <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            value={reservationForm.userName}
                                            onChange={(e) => setReservationForm({ ...reservationForm, userName: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400"
                                            placeholder="Таны нэр"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Утасны дугаар <span className="text-red-500">*</span></label>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Монгол эсвэл Солонгос утасны дугаар</p>
                                        <input
                                            type="tel"
                                            required
                                            value={reservationForm.phone}
                                            onChange={(e) => setReservationForm({ ...reservationForm, phone: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400"
                                            placeholder="Утасны дугаар"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Facebook ID</label>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Та Facebook ID-аа үлдээвэл бид холбогдох болно</p>
                                        <input
                                            type="text"
                                            value={reservationForm.facebookId}
                                            onChange={(e) => setReservationForm({ ...reservationForm, facebookId: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400"
                                            placeholder="Facebook ID"
                                        />
                                    </div>

                                    {reservationStatus === 'error' && (
                                        <p className="text-red-500 text-sm text-center">Алдаа гарлаа. Дахин оролдоно уу.</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={reservationStatus === 'submitting'}
                                        className="w-full bg-primary text-white font-bold h-12 rounded-xl shadow-lg shadow-primary/30 mt-4 active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
                                    >
                                        {reservationStatus === 'submitting' ? (
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span>Захиалга илгээх</span>
                                                <span className="material-symbols-outlined">send</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
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
