import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProducts, saveProduct, getCategories, getExchangeRate } from '../../utils/storage';
import type { Product, Category } from '../../utils/storage';

export default function AdminProductCreate() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [exchangeRate, setExchangeRate] = useState(2.5);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form State
    const [images, setImages] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        price: '', // MNT display string
        priceKRW: '', // KRW number input
        year: '',
        mileage: '',
        fuel: '',
        engine: '',
        transmission: '',
        drive: '',
        color: '',
        interiorColor: '',
        doors: '',
        description: '',
        categoryId: '',
        status: 'active'
    });

    useEffect(() => {
        const loadData = async () => {
            const rate = getExchangeRate();
            setExchangeRate(rate.krwToMnt);

            const allCategories = await getCategories();
            setCategories(allCategories);

            if (id) {
                setIsEditing(true);
                const products = await getProducts();
                const productToEdit = products.find(p => p.id === Number(id));
                if (productToEdit) {
                    setFormData({
                        name: productToEdit.name,
                        price: productToEdit.price,
                        priceKRW: productToEdit.priceKRW ? productToEdit.priceKRW.toString() : '',
                        year: productToEdit.year,
                        mileage: productToEdit.mileage,
                        fuel: productToEdit.fuel,
                        engine: productToEdit.engine || '',
                        transmission: productToEdit.transmission || '',
                        drive: productToEdit.drive || '',
                        color: productToEdit.color || '',
                        interiorColor: productToEdit.interiorColor || '',
                        doors: productToEdit.doors || '',
                        description: productToEdit.description || '',
                        categoryId: productToEdit.categoryId.toString(),
                        status: productToEdit.status
                    });
                    setImages(productToEdit.images);
                }
            }
            setLoading(false);
        };

        loadData();
    }, [id]);

    // Form State
    const [images, setImages] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        price: '', // MNT display string
        priceKRW: '', // KRW number input
        year: '',
        mileage: '',
        fuel: '',
        engine: '',
        transmission: '',
        drive: '',
        color: '',
        interiorColor: '',
        doors: '',
        description: '',
        categoryId: '',
        status: 'active'
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            Array.from(e.target.files).forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (reader.result) {
                        setImages(prev => [...prev, reader.result as string]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'priceKRW') {
            const krw = parseFloat(value);
            if (!isNaN(krw)) {
                // Auto-calculate MNT price
                const mnt = krw * exchangeRate;
                const mntFormatted = (mnt / 1000000).toFixed(1) + " сая ₮";
                setFormData(prev => ({ ...prev, [name]: value, price: mntFormatted }));
            } else {
                setFormData(prev => ({ ...prev, [name]: value }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const productData: Omit<Product, 'id'> = {
            name: formData.name,
            price: formData.price,
            priceKRW: parseFloat(formData.priceKRW) || undefined,
            year: formData.year,
            mileage: formData.mileage,
            fuel: formData.fuel,
            images: images,
            tags: [formData.year, formData.fuel],
            status: formData.status as 'active' | 'sold' | 'pending' | 'discounted',
            description: formData.description,
            categoryId: Number(formData.categoryId) || 0,
            engine: formData.engine,
            transmission: formData.transmission,
            drive: formData.drive,
            color: formData.color,
            interiorColor: formData.interiorColor,
            doors: formData.doors
        };

        await saveProduct(isEditing ? { ...productData, id: Number(id) } as Product : productData);
        navigate('/admin/products');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/admin/products')}
                    className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-primary transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {isEditing ? 'Машин засах' : 'Шинэ машин нэмэх'}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">

                {/* Image Upload */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Зураг оруулах</h3>
                    <div className="flex flex-wrap gap-4">
                        {images.map((img, index) => (
                            <div key={index} className="w-32 h-24 rounded-lg overflow-hidden relative group">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <span className="material-symbols-outlined text-white">delete</span>
                                </button>
                            </div>
                        ))}
                        <label className="w-32 h-24 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-primary">
                            <span className="material-symbols-outlined text-2xl mb-1">add_photo_alternate</span>
                            <span className="text-xs font-bold">Зураг нэмэх</span>
                            <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                    </div>
                </div>

                {/* Basic Info */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Үндсэн мэдээлэл</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="block">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Нэр / Загвар</span>
                            <input name="name" required value={formData.name} onChange={handleChange} type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Toyota Prius 30" />
                        </label>

                        {/* Price Section */}
                        <label className="block">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Үнэ (KRW)</span>
                            <input name="priceKRW" required value={formData.priceKRW} onChange={handleChange} type="number" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="10000000" />
                        </label>
                        <label className="block">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Монголд очих үнэ (MNT)</span>
                            <input name="price" required value={formData.price} onChange={handleChange} type="text" className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary text-primary font-bold" placeholder="Автоматаар бодогдоно" />
                            <p className="text-xs text-slate-400 mt-1">Ханш: 1 KRW = {exchangeRate} MNT</p>
                        </label>

                        <label className="block">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Ангилал</span>
                            <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary">
                                <option value="">Сонгох...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </label>
                        <label className="block">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Үйлдвэрлэсэн он</span>
                            <input name="year" required value={formData.year} onChange={handleChange} type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="2015" />
                        </label>
                        <label className="block">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Гүйлт (км)</span>
                            <input name="mileage" required value={formData.mileage} onChange={handleChange} type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="120,000" />
                        </label>
                        <label className="block">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Түлш</span>
                            <select name="fuel" value={formData.fuel} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary">
                                <option value="">Сонгох...</option>
                                <option value="Petrol">Бензин</option>
                                <option value="Diesel">Дизель</option>
                                <option value="Hybrid">Хайбрид</option>
                                <option value="Electric">Цахилгаан</option>
                                <option value="Gas">Газ</option>
                            </select>
                        </label>
                        <label className="block">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Төлөв</span>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary">
                                <option value="active">Бэлэн</option>
                                <option value="sold">Зарагдсан</option>
                                <option value="pending">Хүлээгдэж буй</option>
                                <option value="discounted">Хямдарсан</option>
                            </select>
                        </label>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Дэлгэрэнгүй мэдээлэл</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="block">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Хөдөлгүүр (Engine)</span>
                            <input name="engine" value={formData.engine} onChange={handleChange} type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="2.0L Turbo" />
                        </label>
                        <label className="block">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Хурдны хайрцаг (Transmission)</span>
                            <input name="transmission" value={formData.transmission} onChange={handleChange} type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Automatic" />
                        </label>
                        <label className="block">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Хөтлөгч (Drive)</span>
                            <input name="drive" value={formData.drive} onChange={handleChange} type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="4WD, FWD" />
                        </label>
                        <label className="block">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Өнгө (Color)</span>
                            <input name="color" value={formData.color} onChange={handleChange} type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Цагаан" />
                        </label>
                        <label className="block">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Дотор өнгө (Interior Color)</span>
                            <input name="interiorColor" value={formData.interiorColor} onChange={handleChange} type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Хар арьс" />
                        </label>
                        <label className="block">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Хаалга (Doors)</span>
                            <input name="doors" value={formData.doors} onChange={handleChange} type="text" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="5" />
                        </label>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Тайлбар (Description)</h3>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={5}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary resize-y"
                        placeholder="Машины талаар дэлгэрэнгүй тайлбар..."
                    />
                </div>

                <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-700">
                    <button type="submit" className="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 transition-all">
                        {isEditing ? 'Шинэчлэх' : 'Нийтлэх'}
                    </button>
                </div>
            </form >
        </div >
    );
}
