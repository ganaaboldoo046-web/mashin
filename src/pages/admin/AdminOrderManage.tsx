
import { useEffect, useState } from 'react';

export default function AdminOrderManage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/reservations_list');
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (id: number, newStatus: string) => {
        if (!confirm('Status-г өөрчлөх үү?')) return;

        try {
            const res = await fetch('/api/reservations_update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });

            if (res.ok) {
                // Optimistic update
                setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            alert('Error updating status');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Энэ захиалгыг устгахдаа итгэлтэй байна уу?')) return;

        try {
            const res = await fetch(`/api/reservations_delete?id=${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setOrders(prev => prev.filter(o => o.id !== id));
            } else {
                alert('Failed to delete reservation');
            }
        } catch (error) {
            alert('Error deleting reservation');
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading orders...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Захиалга удирдах</h2>
                <button onClick={fetchOrders} className="p-2 text-slate-500 hover:text-slate-900 bg-slate-100 rounded-lg">
                    <span className="material-symbols-outlined">refresh</span>
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                            <tr>
                                <th className="p-4 font-semibold">ID</th>
                                <th className="p-4 font-semibold">Бүтээгдэхүүн</th>
                                <th className="p-4 font-semibold">Хэрэглэгч</th>
                                <th className="p-4 font-semibold">Холбоо барих</th>
                                <th className="p-4 font-semibold">Огноо</th>
                                <th className="p-4 font-semibold">Төлөв</th>
                                <th className="p-4 font-semibold">Үйлдэл</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {orders.map((order) => {
                                let mainImage = '';
                                try {
                                    if (order.product_images) {
                                        const parsedImages = JSON.parse(order.product_images);
                                        if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                                            mainImage = parsedImages[0];
                                        }
                                    }
                                } catch (e) {
                                    console.error('Failed to parse images', e);
                                }

                                return (
                                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="p-4 text-slate-500">#{order.id}</td>
                                        <td className="p-4 font-medium text-slate-900 dark:text-white">
                                            <div className="flex items-center gap-3">
                                                {mainImage ? (
                                                    <img
                                                        src={mainImage}
                                                        alt={order.product_name}
                                                        className="w-12 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-600"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400">
                                                        <span className="material-symbols-outlined text-lg">image_not_supported</span>
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-bold">{order.product_name}</div>
                                                    <div className="text-xs text-slate-400">ID: {order.product_id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-slate-900 dark:text-white">{order.user_name}</div>
                                            {order.facebook_id && (
                                                <div className="text-xs text-blue-500">FB: {order.facebook_id}</div>
                                            )}
                                        </td>
                                        <td className="p-4 text-slate-600 dark:text-slate-300">
                                            {order.phone}
                                        </td>
                                        <td className="p-4 text-slate-500">
                                            {new Date(order.created_at * 1000).toISOString().slice(0, 10)}
                                            <div className="text-xs">{new Date(order.created_at * 1000).toISOString().slice(11, 16)}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {order.status === 'pending' ? 'Хүлээгдэж буй' :
                                                    order.status === 'confirmed' ? 'Баталгаажсан' :
                                                        order.status === 'completed' ? 'Дууссан' :
                                                            order.status === 'cancelled' ? 'Цуцлагдсан' : order.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                    className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-primary outline-none"
                                                >
                                                    <option value="pending">Хүлээгдэж буй</option>
                                                    <option value="confirmed">Баталгаажсан</option>
                                                    <option value="completed">Дууссан</option>
                                                    <option value="cancelled">Цуцлагдсан</option>
                                                </select>
                                                <button
                                                    onClick={() => handleDelete(order.id)}
                                                    className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                                    title="Устгах"
                                                >
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-500">
                                        Захиалга байхгүй байна.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
