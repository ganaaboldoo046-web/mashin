import { useEffect, useState } from 'react';
import { getProducts } from '../../utils/storage';
import type { Product } from '../../utils/storage';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        newOrders: 3, // Mock for now if no orders table
        totalVisits: 1234, // Mock
        revenue: '₮45.2M' // Mock
    });
    const [recentProducts, setRecentProducts] = useState<Product[]>([]);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                // Fetch Stats
                const statsRes = await fetch('/api/admin_stats');
                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    setStats(statsData);
                }

                // Fetch Recent Products
                const allProducts = await getProducts();
                // Sort by ID desc (newest first) if not already
                const sortedProducts = allProducts.sort((a, b) => b.id - a.id);
                setRecentProducts(sortedProducts.slice(0, 5));
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            }
        };
        loadDashboardData();
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Хяналтын самбар</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <StatCard title="Нийт автомашин" value={stats.totalProducts.toString()} icon="directions_car" color="bg-blue-500" />
                <StatCard title="Шинэ захиалга" value={stats.newOrders.toString()} icon="shopping_cart" color="bg-green-500" />
                <StatCard title="Нийт хандалт" value={stats.totalVisits.toLocaleString()} icon="visibility" color="bg-purple-500" />
                <StatCard title="Орлого" value={stats.revenue} icon="payments" color="bg-orange-500" />
            </div>

            <div className="grid grid-cols-1 gap-8">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                    <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Сүүлд нэмэгдсэн</h3>
                    <div className="space-y-4">
                        {recentProducts.map(p => (
                            <div key={p.id} className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0">
                                <div className="w-16 h-12 bg-slate-200 rounded-lg overflow-hidden">
                                    <img src={p.images[0]} className="w-full h-full object-cover" alt={p.name} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{p.name}</h4>
                                    <p className="text-xs text-slate-500">{p.year} • {p.fuel}</p>
                                </div>
                                <span className={`ml-auto text-xs font-bold px-2 py-1 rounded-full ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                                    }`}>
                                    {p.status === 'active' ? 'Бэлэн' : p.status}
                                </span>
                            </div>
                        ))}
                        {recentProducts.length === 0 && (
                            <p className="text-center text-slate-500 py-4">Мэдээлэл байхгүй байна</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }: { title: string, value: string, icon: string, color: string }) {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white shadow-lg shadow-${color.replace('bg-', '')}/30`}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
        </div>
    )
}
