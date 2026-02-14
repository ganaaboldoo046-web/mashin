import React from 'react';
import BottomNav from '../components/BottomNav';
import { getProducts, getSavedIds, getRecentlyViewedIds } from '../utils/storage';
import type { Product } from '../utils/storage';

export default function Profile() {
    const [user, setUser] = React.useState<any>(null);
    const [isLogin, setIsLogin] = React.useState(true);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [error, setError] = React.useState('');

    // Tabs State
    const [activeTab, setActiveTab] = React.useState<'recent' | 'saved'>('recent');
    const [recentProducts, setRecentProducts] = React.useState<Product[]>([]);
    const [savedProducts, setSavedProducts] = React.useState<Product[]>([]);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('somang_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
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

    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (isLogin) {
            // Mock Login Logic
            const mockUser = {
                email: email,
                name: email.split('@')[0],
                avatar: null
            };
            localStorage.setItem('somang_user', JSON.stringify(mockUser));
            setUser(mockUser);
        } else {
            // Signup Validation
            if (password.length < 6) {
                setError('Нууц үг хэтэрхий богино байна.');
                return;
            }
            if (password !== confirmPassword) {
                setError('Нууц үг тохирохгүй байна.');
                return;
            }

            // Mock Signup Logic
            const mockUser = {
                email: email,
                name: name,
                phone: phone,
                avatar: null
            };
            localStorage.setItem('somang_user', JSON.stringify(mockUser));
            setUser(mockUser);
        }
    };

    const handleGoogleLogin = () => {
        // Mock Google Auth
        const mockUser = {
            email: 'user@gmail.com',
            name: 'Google User',
            avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c' // Generic avatar
        };
        localStorage.setItem('somang_user', JSON.stringify(mockUser));
        setUser(mockUser);
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
                                className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'saved'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                    }`}
                            >
                                Хадгалсан
                            </button>
                        </div>

                        <div className="mt-4 pb-20">
                            {activeTab === 'recent' && (
                                <ProductList products={recentProducts} emptyMessage="Сүүлд үзсэн зар байхгүй байна." />
                            )}
                            {activeTab === 'saved' && (
                                <ProductList products={savedProducts} emptyMessage="Хадгалсан зар байхгүй байна." />
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
        <div className="pb-24 min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-2">Somang</h1>
                    <p className="text-slate-500 dark:text-slate-400">Тавтай морилно уу</p>
                </div>

                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-8">
                    <button
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white dark:bg-slate-700 shadow text-primary' : 'text-slate-500'}`}
                        onClick={() => { setIsLogin(true); setError(''); }}
                    >
                        Нэвтрэх
                    </button>
                    <button
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white dark:bg-slate-700 shadow text-primary' : 'text-slate-500'}`}
                        onClick={() => { setIsLogin(false); setError(''); }}
                    >
                        Бүртгүүлэх
                    </button>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    {!isLogin && (
                        <>
                            <input
                                type="text"
                                placeholder="Нэр"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <input
                                type="tel"
                                placeholder="Утасны дугаар"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </>
                    )}

                    <input
                        type="email"
                        placeholder="Имэйл хаяг"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Нууц үг"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {!isLogin && (
                        <input
                            type="password"
                            placeholder="Нууц үг давтах"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    )}

                    {error && (
                        <div className="p-3 bg-red-100 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">error</span>
                            {error}
                        </div>
                    )}

                    <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 active:scale-95 transition-all">
                        {isLogin ? 'Нэвтрэх' : 'Бүртгүүлэх'}
                    </button>
                </form>

                <div className="my-8 flex items-center gap-4">
                    <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                    <span className="text-xs text-slate-400 font-bold uppercase">Эсвэл</span>
                    <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                    <span>Google-ээр нэвтрэх</span>
                </button>
            </div>
            <BottomNav />
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
