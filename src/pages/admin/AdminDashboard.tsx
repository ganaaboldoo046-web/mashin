

export default function AdminDashboard() {
    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Хяналтын самбар</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <StatCard title="Нийт автомашин" value="42" icon="directions_car" color="bg-blue-500" />
                <StatCard title="Шинэ захиалга" value="3" icon="shopping_cart" color="bg-green-500" />
                <StatCard title="Нийт хандалт" value="1,234" icon="visibility" color="bg-purple-500" />
                <StatCard title="Орлого" value="₮45.2M" icon="payments" color="bg-orange-500" />
            </div>

            <div className="grid grid-cols-1 gap-8">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                    <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Сүүлд нэмэгдсэн</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0">
                                <div className="w-16 h-12 bg-slate-200 rounded-lg overflow-hidden">
                                    <img src={`https://source.unsplash.com/random/200x200?car&sig=${i}`} className="w-full h-full object-cover" alt="Car" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Hyundai Santa Fe 2023</h4>
                                    <p className="text-xs text-slate-500">2024-02-14 15:30</p>
                                </div>
                                <span className="ml-auto text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full">Бэлэн</span>
                            </div>
                        ))}
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
