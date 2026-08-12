import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProducts, saveProduct, getCategories, getExchangeRate, uploadImage } from '../../utils/storage';
import type { Product, Category } from '../../utils/storage';
import { convertToWebP } from '../../utils/image';
import { VEHICLE_OPTIONS, OPTION_CATEGORIES } from '../../constants/vehicleOptions';

export default function AdminProductCreate() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [exchangeRate, setExchangeRate] = useState(2.5);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form State
    /** Already-uploaded images carry `url`; newly picked ones carry `file`. Keeping
     *  both on one item avoids the two arrays drifting out of sync on edit. */
    const [images, setImages] = useState<{ preview: string; url?: string; file?: File }[]>([]);
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
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

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
                    setImages(productToEdit.images.map((url) => ({ preview: url, url })));
                    setSelectedOptions(productToEdit.options || []);
                }
            }
            setLoading(false);
        };

        loadData();
    }, [id]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const picked = Array.from(e.target.files).map((file) => ({
            preview: URL.createObjectURL(file),
            file,
        }));
        setImages((prev) => [...prev, ...picked]);
        e.target.value = '';
    };

    const removeImage = (index: number) => {
        setImages((prev) => {
            const target = prev[index];
            if (target?.file) URL.revokeObjectURL(target.preview);
            return prev.filter((_, i) => i !== index);
        });
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

    const handleOptionToggle = (optionId: string) => {
        setSelectedOptions(prev =>
            prev.includes(optionId)
                ? prev.filter(id => id !== optionId)
                : [...prev, optionId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Process and Upload Images to R2. Only R2 URLs may reach D1 — a
            // base64 payload here would blow past the row limit (SQLITE_TOOBIG).
            const uploadedImageUrls: string[] = [];

            for (const image of images) {
                if (image.url) {
                    uploadedImageUrls.push(image.url);
                } else if (image.file) {
                    const webpBlob = await convertToWebP(image.file);
                    uploadedImageUrls.push(await uploadImage(webpBlob));
                }
            }

            const productData: Omit<Product, 'id'> = {
                name: formData.name,
                price: formData.price,
                priceKRW: parseFloat(formData.priceKRW) || undefined,
                year: formData.year,
                mileage: formData.mileage,
                fuel: formData.fuel,
                images: uploadedImageUrls,
                tags: [formData.year, formData.fuel],
                status: formData.status as 'active' | 'sold' | 'pending' | 'discounted',
                description: formData.description,
                categoryId: Number(formData.categoryId) || 0,
                engine: formData.engine,
                transmission: formData.transmission,
                drive: formData.drive,
                color: formData.color,
                interiorColor: formData.interiorColor,
                doors: formData.doors,
                options: selectedOptions
            };

            await saveProduct(isEditing ? { ...productData, id: Number(id) } as Product : productData);
            navigate('/admin/products');
        } catch (err) {
            console.error('Save failed:', err);
            alert(`Хадгалахад алдаа гарлаа.\n\n${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !isEditing) return <div>Loading...</div>;

    const groupedOptions = VEHICLE_OPTIONS.reduce((acc, option) => {
        if (!acc[option.category]) acc[option.category] = [];
        acc[option.category].push(option);
        return acc;
    }, {} as Record<string, typeof VEHICLE_OPTIONS>);

    return (
        <div className="max-w-4xl mx-auto pb-20">
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
                        {images.map((image, index) => (
                            <div key={image.preview} className="w-32 h-24 rounded-lg overflow-hidden relative group">
                                <img src={image.preview} alt="" className="w-full h-full object-cover" />
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

                {/* Option Selection (Icons) */}
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Машины опци (Vehicle Options)</h3>
                    <div className="space-y-6">
                        {Object.entries(OPTION_CATEGORIES).map(([catKey, catLabel]) => {
                            const opts = groupedOptions[catKey] || [];
                            if (opts.length === 0) return null;

                            return (
                                <div key={catKey}>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 border-b border-slate-100 dark:border-slate-700 pb-1">{catLabel}</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {opts.map(opt => (
                                            <label key={opt.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedOptions.includes(opt.id)
                                                ? 'bg-primary/5 border-primary ring-1 ring-primary'
                                                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                }`}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedOptions.includes(opt.id)}
                                                    onChange={() => handleOptionToggle(opt.id)}
                                                    className="w-4 h-4 rounded text-primary focus:ring-primary border-slate-300"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <span className={`material-symbols-outlined text-xl ${selectedOptions.includes(opt.id) ? 'text-primary' : 'text-slate-400'}`}>
                                                        {opt.icon}
                                                    </span>
                                                    <span className={`text-xs font-medium ${selectedOptions.includes(opt.id) ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                                                        {opt.label}
                                                    </span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
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
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary hover:bg-blue-600 disabled:bg-slate-400 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 transition-all flex items-center gap-2"
                    >
                        {loading && <span className="animate-spin text-sm">↻</span>}
                        {isEditing ? 'Шинэчлэх' : 'Нийтлэх'}
                    </button>
                </div>
            </form >
        </div >
    );
}
