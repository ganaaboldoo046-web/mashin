import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import TopTicker from '../components/TopTicker';
import BottomNav from '../components/BottomNav';
import CarCard from '../components/CarCard';
import Footer from '../components/Footer';
import { setUser as persistUser } from '../hooks/useUser';
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

                persistUser(appUser);
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
        persistUser(null);
        setUser(null);
    };

    if (user) {
        return (
            <div className="min-h-screen bg-canvas pb-24 lg:pb-0">
                <Header />
                <TopTicker />

                <main className="px-4 pt-4 lg:max-w-shell lg:mx-auto lg:px-6 lg:pt-8 lg:pb-20">
                    <div className="bg-surface border border-line rounded-2xl p-5 flex items-center gap-3.5 lg:p-6">
                        <div className="w-[52px] h-[52px] flex-none rounded-full bg-primary-soft text-primary flex items-center justify-center text-[19px] font-extrabold overflow-hidden">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                user.name[0].toUpperCase()
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-base font-extrabold truncate lg:text-lg">{user.name}</div>
                            <div className="mt-[3px] text-[12.5px] text-muted truncate">{user.email}</div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="h-9 px-3.5 flex-none rounded-[10px] border border-line-strong bg-surface text-[13px] font-bold text-danger whitespace-nowrap"
                        >
                            Гарах
                        </button>
                    </div>

                    <div className="mt-3 bg-surface border border-line rounded-2xl overflow-hidden">
                        {[
                            { label: 'Хадгалсан зар', to: '/saved' },
                            { label: 'Машин үзэх', to: '/search' },
                            { label: 'Бидний тухай', to: '/about' },
                            { label: 'Үйлчилгээний нөхцөл', to: '/terms' },
                        ].map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                className="flex items-center justify-between min-h-[52px] px-[18px] border-b border-line-soft last:border-b-0 text-sm font-bold text-ink hover:text-ink"
                            >
                                <span>{item.label}</span>
                                <span className="text-[#c3c9d2] text-[15px]">›</span>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-4">
                        <div className="flex border-b border-line">
                            <button
                                onClick={() => setActiveTab('recent')}
                                className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'recent'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted hover:text-ink'
                                    }`}
                            >
                                Сүүлд үзсэн
                            </button>
                            <button
                                onClick={() => setActiveTab('saved')}
                                className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-4 ${activeTab === 'saved'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted hover:text-ink'
                                    }`}
                            >
                                Хадгалсан
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-4 ${activeTab === 'orders'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted hover:text-ink'
                                    }`}
                            >
                                Миний захиалга
                            </button>
                        </div>

                        <div className="mt-4">
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
                    </div>

                    <div className="mt-4 bg-night rounded-2xl p-5 lg:hidden">
                        <div className="text-[11.5px] font-bold tracking-[0.1em] text-night-line">DT-TRADING</div>
                        <a href="tel:01057279927" className="block mt-2.5 text-base font-extrabold text-white hover:text-white">
                            010 5727 9927
                        </a>
                        <a href="tel:99001979" className="block mt-0.5 text-[13.5px] font-bold text-night-text hover:text-night-text">
                            9900 1979
                        </a>
                        <p className="mt-3 text-xs leading-[1.6] text-night-text">Инчон хот, Ённсү дүүрэг, Нынхөдэ-ро 192</p>
                    </div>
                </main>

                <div className="hidden lg:block">
                    <Footer />
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
                    DT-TRADING
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
            <div className="bg-surface border border-line rounded-2xl px-5 py-12 text-center">
                <p className="text-[13px] text-muted">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {products.map((product) => (
                <CarCard key={product.id} product={product} variant="mini" savable={false} />
            ))}
        </div>
    );
}

function OrderList({ orders, emptyMessage }: { orders: any[], emptyMessage: string }) {
    if (!orders || orders.length === 0) {
        return (
            <div className="bg-surface border border-line rounded-2xl px-5 py-12 text-center">
                <p className="text-[13px] text-muted">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {orders.map((order) => (
                <div key={order.id} className="bg-surface border border-line rounded-2xl p-4">
                    <div className="flex justify-between items-start gap-3 mb-2">
                        <h3 className="text-sm font-extrabold text-ink">{order.product_name}</h3>
                        <span className={`text-[11px] font-bold px-2 py-1 rounded-[5px] whitespace-nowrap ${order.status === 'pending' ? 'bg-[#fff4e0] text-[#b26a00]' :
                            order.status === 'confirmed' ? 'bg-primary-soft text-primary' :
                                order.status === 'completed' ? 'bg-[#e6f6ec] text-[#1a7f45]' :
                                    'bg-[#fdeaea] text-danger'
                            }`}>
                            {order.status === 'pending' ? 'Хүлээгдэж буй' :
                                order.status === 'confirmed' ? 'Баталгаажсан' :
                                    order.status === 'completed' ? 'Дууссан' : 'Цуцлагдсан'}
                        </span>
                    </div>
                    <div className="text-[12.5px] text-muted flex flex-wrap gap-x-4 gap-y-1">
                        <span>{new Date(order.created_at * 1000).toLocaleDateString()}</span>
                        {order.phone && <span>{order.phone}</span>}
                    </div>
                </div>
            ))}
        </div>
    );
}
