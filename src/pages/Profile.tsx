import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import BottomNav from '../components/BottomNav';
import { getProducts, getSavedIds, getRecentlyViewedIds } from '../utils/storage';
import type { Product } from '../utils/storage';

// Import login background images
import img1 from '../assets/login/img1.jpg';
import img2 from '../assets/login/img2.jpg';
import img3 from '../assets/login/img3.jpg';
import img4 from '../assets/login/img4.jpg';
import img5 from '../assets/login/img5.jpg';

export default function Profile() {
    const [user, setUser] = React.useState<any>(null);

    // Tabs State
    const [activeTab, setActiveTab] = React.useState<'recent' | 'saved' | 'orders'>('recent');
    const [recentProducts, setRecentProducts] = React.useState<Product[]>([]);
    const [savedProducts, setSavedProducts] = React.useState<Product[]>([]);
    const [myOrders, setMyOrders] = React.useState<any[]>([]);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('somang_user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);

            // Clear legacy mock data if detected
            if (parsedUser.email === 'user@gmail.com' && parsedUser.name === 'Google User') {
                localStorage.removeItem('somang_user');
                setUser(null);
                return;
            }

            setUser(parsedUser);

            // Fetch My Orders
            const fetchMyOrders = async () => {
                try {
                    // Use email or phone as identifier
                    const userId = parsedUser.email || parsedUser.phone;
                    if (!userId) return;

                    const res = await fetch(`/api/reservations_list?userId=${encodeURIComponent(userId)}`);
                    if (res.ok) {
                        const data = await res.json();
                        setMyOrders(data as any[]);
                    }
                } catch (error) {
                    console.error("Failed to fetch orders", error);
                }
            };
            fetchMyOrders();
        }

        // Load Tab Data
        const loadTabData = async () => {
            const allProducts = await getProducts();
            const recentIds = getRecentlyViewedIds();
            const savedIds = getSavedIds();

            // Map IDs to products and filter out undefined results
            const orderedRecent = recentIds
                .map(id => allProducts.find(p => p.id === id))
                .filter((p): p is Product => !!p);

            const saved = allProducts.filter(p => savedIds.includes(p.id));

            setRecentProducts(orderedRecent);
            setSavedProducts(saved);
        };

        loadTabData();
        window.addEventListener('storageRecent', loadTabData);
        window.addEventListener('storageSaved', loadTabData);

        return () => {
            window.removeEventListener('storageRecent', loadTabData);
            window.removeEventListener('storageSaved', loadTabData);
        };
    }, []);

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const userData = await res.json();

                // Format user data to match app structure
                const appUser = {
                    email: userData.email,
                    name: userData.name,
                    avatar: userData.picture,
                    googleId: userData.sub
                };

                localStorage.setItem('somang_user', JSON.stringify(appUser));
                setUser(appUser);
            } catch (error) {
                console.error("Failed to fetch user info:", error);
                alert("로그인 정보를 가져오는데 실패했습니다.");
            }
        },
        onError: () => {
            console.error("Login Failed");
            alert("로그인에 실패했습니다.");
        }
    });

    const handleGoogleLogin = () => {
        login();
    };

    const handleLogout = () => {
        localStorage.removeItem('somang_user');
        setUser(null);
    };

    if (user) {
        return (
            <div className="pb-24 min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
                <div className="bg-white dark:bg-slate-800 p-8 text-center shadow-sm">
                    <div className="w-24 h-24 mx-auto bg-primary/10 text-primary rounded-full flex items-center justify-center text-3xl font-bold mb-4 overflow-hidden">
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            user.name[0].toUpperCase()
                        )}
                    </div>
                    <h1 className="text-2xl font-bold">{user.name}</h1>
                    <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
                </div>

                <div className="p-4 space-y-3 mt-4">
                    <div className="mt-6">
                        <div className="flex border-b border-slate-200 dark:border-slate-800">
                            <button
                                onClick={() => setActiveTab('recent')}
                                className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'recent'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                    }`}
                            >
                                Сүүлд үзсэн
                            </button>
                            <button
                                onClick={() => setActiveTab('saved')}
                                className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-4 ${activeTab === 'saved'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                    }`}
                            >
                                Хадгалсан
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-4 ${activeTab === 'orders'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                    }`}
                            >
                                Миний захиалга
                            </button>
                        </div>

                        <div className="mt-4 pb-20">
                            {activeTab === 'recent' && (
                                <ProductList products={recentProducts} emptyMessage="Сүүлд үзсэн зар байхгүй байна." />
                            )}
                            {activeTab === 'saved' && (
                                <ProductList products={savedProducts} emptyMessage="Хадгалсан зар байхгүй байна." />
                            )}
                            {activeTab === 'orders' && (
                                <OrderList orders={myOrders} emptyMessage="Захиалгын түүх байхгүй байна." />
                            )}
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-bold active:scale-95 transition-all"
                        >
                            <span className="material-symbols-outlined">logout</span>
                            Гарах
                        </button>
                    </div>
                </div>
                <BottomNav />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-black overflow-hidden flex flex-col justify-center items-center">
            {/* Background Marquee Container */}
            <div className="fixed inset-0 z-0 bg-black">
                <div className="absolute inset-0 flex gap-4 opacity-60">
                    {/* Column 1 - Downward Marquee */}
                    <div className="flex-1 min-w-[33%] animate-marquee-vertical-slow flex flex-col gap-4">
                        {[img1, img2, img3, img4, img5, img1, img2, img3].map((img, idx) => (
                            <img key={idx} src={img} className="w-full h-auto rounded-lg aspect-[3/4] object-cover" alt="" />
                        ))}
                    </div>
                    {/* Column 2 - Upward Marquee (slower) */}
                    <div className="flex-1 min-w-[33%] animate-marquee-vertical-reverse flex flex-col gap-4 pt-20">
                        {[img3, img4, img5, img1, img2, img3, img4, img5].map((img, idx) => (
                            <img key={idx} src={img} className="w-full h-auto rounded-lg aspect-[3/4] object-cover" alt="" />
                        ))}
                    </div>
                    {/* Column 3 - Downward Marquee */}
                    <div className="flex-1 min-w-[33%] animate-marquee-vertical flex flex-col gap-4">
                        {[img5, img1, img2, img3, img4, img5, img1, img2].map((img, idx) => (
                            <img key={idx} src={img} className="w-full h-auto rounded-lg aspect-[3/4] object-cover" alt="" />
                        ))}
                    </div>
                </div>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90 z-10" />
            </div>

            {/* Login Content */}
            <div className="relative z-20 w-full max-w-md px-6 text-center text-white flex flex-col items-center justify-center min-h-[80vh]">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 drop-shadow-lg">
                    TEMMUN <br /> TRADING
                </h1>
                <p className="text-lg md:text-xl font-medium text-slate-200 mb-12 drop-shadow-md leading-relaxed whitespace-pre-line">
                    Бүх төрлийн АВТО МАШИН захиалга авч <br />түргэн шуурхай найдвартай нийлүүлсээр байна
                </p>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full max-w-xs py-4 bg-white text-slate-900 border border-slate-200 font-bold rounded-full flex items-center justify-center gap-3 hover:bg-slate-50 transition-transform active:scale-95 shadow-xl group"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6 group-hover:scale-110 transition-transform" alt="Google" />
                    <span>Google-ээр нэвтрэх</span>
                </button>

                <p className="mt-6 text-xs text-slate-400">
                    Үйлчилгээний нөхцөл болон нууцлалын бодлогыг зөвшөөрч байна.
                </p>
            </div>

            <div className="relative z-20 mt-auto w-full">
                <BottomNav />
            </div>
        </div>
    );
}

function ProductList({ products, emptyMessage }: { products: Product[], emptyMessage: string }) {
    if (products.length === 0) {
        return (
            <div className="text-center py-10 text-slate-500">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">toc</span>
                <p>{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
                <a href={`/product/${product.id}`} key={product.id} className="block bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="aspect-[4/3] relative">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                        <h3 className="font-bold text-sm truncate text-slate-900 dark:text-white">{product.name}</h3>
                        <p className="text-primary font-bold text-sm mt-1">{product.price}</p>
                    </div>
                </a>
            ))}
        </div>
    );
}

function OrderList({ orders, emptyMessage }: { orders: any[], emptyMessage: string }) {
    if (!orders || orders.length === 0) {
        return (
            <div className="text-center py-10 text-slate-500">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">receipt_long</span>
                <p>{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {orders.map((order) => (
                <div key={order.id} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-900 dark:text-white">{order.product_name}</h3>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                    'bg-red-100 text-red-700'
                            }`}>
                            {order.status === 'pending' ? 'Хүлээгдэж буй' :
                                order.status === 'confirmed' ? 'Баталгаажсан' :
                                    order.status === 'completed' ? 'Дууссан' : 'Цуцлагдсан'}
                        </span>
                    </div>
                    <div className="text-sm text-slate-500 space-y-1">
                        <p className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">calendar_today</span>
                            {new Date(order.created_at * 1000).toLocaleDateString()}
                        </p>
                        {order.phone && (
                            <p className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">call</span>
                                {order.phone}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
