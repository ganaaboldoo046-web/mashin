```
import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, uploadImage } from '../../utils/storage';
import type { Category } from '../../utils/storage';
import { convertToWebP } from '../../utils/image';

export default function AdminCategoryManage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [newCategory, setNewCategory] = useState<Partial<Category>>({ name: '', icon: 'category', image: '' });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            setCategories(await getCategories());
        };
        fetchCategories();
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewCategory({ ...newCategory, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const startEdit = (category: Category) => {
        setEditingId(category.id);
        setNewCategory({
            name: category.name,
            icon: category.icon,
            image: category.image
        });
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingId(null);
        setNewCategory({ name: '', icon: 'category', image: '' });
        setSelectedFile(null);
    };

    const handleSave = async () => {
        if (!newCategory.name) return;
        setLoading(true);

        try {
            let imageUrl = newCategory.image || '';

            if (selectedFile) {
                const webpBlob = await convertToWebP(selectedFile);
                imageUrl = await uploadImage(webpBlob);
            }

            const categoryData: Omit<Category, 'id' | 'count'> = {
                name: newCategory.name,
                icon: newCategory.icon || 'category',
                image: imageUrl
            };

            await createCategory(editingId ? { ...categoryData, id: editingId } as any : categoryData);
            const updated = await getCategories();
            setCategories(updated);
            handleCancel();
        } catch (err) {
            console.error('Save failed:', err);
            alert('Хадгалахад алдаа гарлаа.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Delete this banner?')) {
            const updatedBanners = banners.filter(b => b.id !== id);
            setBanners(updatedBanners);
            saveBanners(updatedBanners);
        }
    };

    const toggleActive = (id: number) => {
        const updatedBanners = banners.map(b => b.id === id ? { ...b, active: !b.active } : b);
        setBanners(updatedBanners);
        saveBanners(updatedBanners);
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Баннер</h2>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-primary hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/30 transition-all"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Шинэ баннер
                    </button>
                )}
            </div>

            {/* Add/Edit Banner Form */}
            {isAdding && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-8 animate-fade-in">
                    <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">
                        {editingId ? 'Баннер засах' : 'Шинэ баннер нэмэх'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Image Upload Area */}
                        <div className="aspect-[2/1] bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center relative overflow-hidden group hover:border-primary transition-colors cursor-pointer">
                            {newBanner.image ? (
                                <>
                                    <img src={newBanner.image} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => setNewBanner({ ...newBanner, image: '' })}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md"
                                    >
                                        <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                </>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                                    <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-primary mb-2">add_photo_alternate</span>
                                    <span className="text-sm font-bold text-slate-500 group-hover:text-primary">Зураг оруулах</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            )}
                        </div>

                        {/* Inputs */}
                        <div className="md:col-span-2 space-y-4">
                            <label className="block">
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Гарчиг</span>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="Баннерийн гарчиг"
                                    value={newBanner.title}
                                    onChange={e => setNewBanner({ ...newBanner, title: e.target.value })}
                                />
                            </label>
                            <label className="block">
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Дэд гарчиг (Тайлбар)</span>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="Тайлбар бичих"
                                    value={newBanner.subtitle}
                                    onChange={e => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                                />
                            </label>
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    onClick={handleCancel}
                                    className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                                >
                                    Болих
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={!newBanner.image}
                                    className="px-6 py-2.5 rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/30 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {editingId ? 'Шинэчлэх' : 'Хадгалах'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Banner List */}
            <div className="grid grid-cols-1 gap-6">
                {banners.map(banner => (
                    <div key={banner.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row gap-6 items-center">
                        <div className="w-full md:w-64 h-32 rounded-xl overflow-hidden shrink-0 relative group">
                            <img src={banner.image} className="w-full h-full object-cover" alt="Banner" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => startEdit(banner)}>
                                <span className="text-white font-bold">Засах</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase">ID: {banner.id}</span>
                                {banner.active && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase">Идэвхтэй</span>}
                                {!banner.active && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 uppercase">Идэвхгүй</span>}
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{banner.title}</h3>
                            <p className="text-sm text-slate-500">{banner.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => toggleActive(banner.id)}
                                className={`p - 2 rounded - lg transition - colors ${ banner.active ? 'text-green-500 hover:bg-green-50' : 'text-slate-400 hover:bg-slate-100' } `}
                                title={banner.active ? "Идэвхгүй болгох" : "Идэвхжүүлэх"}
                            >
                                <span className="material-symbols-outlined">{banner.active ? 'toggle_on' : 'toggle_off'}</span>
                            </button>
                            <button
                                onClick={() => startEdit(banner)}
                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
                            >
                                <span className="material-symbols-outlined">edit</span>
                            </button>
                            <button
                                onClick={() => handleDelete(banner.id)}
                                className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg text-slate-500"
                            >
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    </div>
                ))}
                {banners.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        <span className="material-symbols-outlined text-4xl mb-2">image_not_supported</span>
                        <p>Баннер байхгүй байна</p>
                    </div>
                )}
            </div>
        </div>
    );
}
