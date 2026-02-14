import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, saveProduct, deleteProduct as apiDeleteProduct } from '../../utils/storage';
import type { Product } from '../../utils/storage';

export default function AdminProductList() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);

    // Function to load products
    const loadProducts = async () => {
        const data = await getProducts();
        setProducts(data);
    };

    useEffect(() => {
        loadProducts(); // Initial load

        // Listen for changes in storage
        window.addEventListener('storageProducts', loadProducts);
        return () => window.removeEventListener('storageProducts', loadProducts);
    }, []);

    const deleteProduct = async (id: number) => {
        await apiDeleteProduct(id);
        window.dispatchEvent(new Event('storageProducts'));
    };

    const handleSaveStatus = async (id: number, newStatus: Product['status']) => {
        const product = products.find(p => p.id === id);
        if (!product) return;

        const updatedProduct = { ...product, status: newStatus };
        await saveProduct(updatedProduct);
        window.dispatchEvent(new Event('storageProducts'));
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Та энэ машиныг устгахдаа итгэлтэй байна уу?')) {
            await deleteProduct(id);
            // The loadProducts function will be called via the event listener,
            // or we can call it directly if we don't want to rely on the event.
            // For immediate UI update, calling it directly is often better.
            await loadProducts();
        }
    };

    const handleStatusChange = async (id: number, newStatus: Product['status']) => {
        await handleSaveStatus(id, newStatus);
        await loadProducts(); // Reload products to reflect the change
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Автомашин</h2>
                <button
                    onClick={() => navigate('/admin/products/create')}
                    className="bg-primary hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/30 transition-all"
                >
                    <span className="material-symbols-outlined">add</span>
                    Шинэ машин нэмэх
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase font-bold text-xs">
                            <tr>
                                <th className="px-6 py-4">Зураг</th>
                                <th className="px-6 py-4">Нэр/Загвар</th>
                                <th className="px-6 py-4">Үнэ</th>
                                <th className="px-6 py-4">Он</th>
                                <th className="px-6 py-4">Гүйлт</th>
                                <th className="px-6 py-4">Төлөв</th>
                                <th className="px-6 py-4 text-right">Үйлдэл</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="w-16 h-12 bg-slate-200 rounded-lg overflow-hidden">
                                            <img src={product.images[0]} className="w-full h-full object-cover" alt="" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{product.name}</td>
                                    <td className="px-6 py-4 text-primary font-bold">{product.price}</td>
                                    <td className="px-6 py-4">{product.year}</td>
                                    <td className="px-6 py-4">{product.mileage}</td>
                                    <td className="px-6 py-4">
                                        <div className="relative">
                                            <select
                                                value={product.status}
                                                onChange={(e) => handleStatusChange(product.id, e.target.value as Product['status'])}
                                                className={`appearance-none cursor-pointer pl-3 pr-8 py-1.5 rounded-full text-xs font-bold bg-transparent outline-none border focus:ring-2 focus:ring-offset-1 transition-all ${product.status === 'active' ? 'bg-green-100 text-green-700 border-green-200 focus:ring-green-500' :
                                                    product.status === 'sold' ? 'bg-red-100 text-red-700 border-red-200 focus:ring-red-500' :
                                                        product.status === 'discounted' ? 'bg-orange-100 text-orange-700 border-orange-200 focus:ring-orange-500' :
                                                            'bg-yellow-100 text-yellow-700 border-yellow-200 focus:ring-yellow-500'
                                                    }`}
                                            >
                                                <option value="active">Бэлэн</option>
                                                <option value="sold">Зарагдсан</option>
                                                <option value="pending">Хүлээгдэж буй</option>
                                                <option value="discounted">Хямдарсан</option>
                                            </select>
                                            <div className={`pointer-events-none absolute inset-y-0 right-2 flex items-center px-1 text-xs ${product.status === 'active' ? 'text-green-700' :
                                                product.status === 'sold' ? 'text-red-700' :
                                                    product.status === 'discounted' ? 'text-orange-700' :
                                                        'text-yellow-700'
                                                }`}>
                                                <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
                                            >
                                                <span className="material-symbols-outlined text-base">edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg text-slate-500"
                                            >
                                                <span className="material-symbols-outlined text-base">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                                        Машин бүртгэгдээгүй байна
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
