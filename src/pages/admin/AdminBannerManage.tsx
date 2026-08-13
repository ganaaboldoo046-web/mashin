import React, { useState, useEffect } from 'react';
import { getBanners, saveBanner, deleteBanner, uploadImage } from '../../utils/storage';
import type { Banner } from '../../utils/storage';
import { convertToWebP } from '../../utils/image';

export default function AdminBannerManage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [newBanner, setNewBanner] = useState<Partial<Banner>>({ title: '', subtitle: '', image: '' });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBanners = async () => {
            setBanners(await getBanners());
        };
        fetchBanners();
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        // Object URL rather than a base64 preview: only the uploaded R2 url may be saved.
        setNewBanner(prev => ({ ...prev, image: URL.createObjectURL(file) }));
    };

    const startEdit = (banner: Banner) => {
        setEditingId(banner.id);
        setSelectedFile(null);
        setNewBanner({
            title: banner.title,
            subtitle: banner.subtitle,
            image: banner.image
        });
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingId(null);
        setNewBanner({ title: '', subtitle: '', image: '' });
        setSelectedFile(null);
    };

    const handleSave = async () => {
        if (!newBanner.image) return;
        setLoading(true);

        try {
            let imageUrl = newBanner.image;

            if (selectedFile) {
                const webpBlob = await convertToWebP(selectedFile);
                imageUrl = await uploadImage(webpBlob);
            }

            if (imageUrl.startsWith('blob:') || imageUrl.startsWith('data:')) {
                throw new Error('Зургийг сервер лүү хуулж чадсангүй. Дахин оролдоно уу.');
            }

            const bannerData: Omit<Banner, 'id'> = {
                title: newBanner.title || 'Гарчиггүй',
                subtitle: newBanner.subtitle || '',
                image: imageUrl,
                active: true,
                bg: 'from-black/60'
            };

            await saveBanner(editingId ? { ...bannerData, id: editingId } as Banner : bannerData);
            const updated = await getBanners();
            setBanners(updated);
            handleCancel();
        } catch (err) {
            console.error('Save failed:', err);
            alert(`Хадгалахад алдаа гарлаа: ${err instanceof Error ? err.message : 'Тодорхойгүй алдаа'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Энэ баннерыг устгахдаа итгэлтэй байна уу?')) {
            try {
                await deleteBanner(id);
                const updated = await getBanners();
                setBanners(updated);
            } catch (err) {
                console.error('Delete failed:', err);
                alert('Устгахад алдаа гарлаа.');
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Баннер удирдах</h2>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">add</span>
                        Шинэ баннер
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-8">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                        {editingId ? 'Баннер засах' : 'Шинэ баннер нэмэх'}
                    </h3>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label className="block">
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Гарчиг</span>
                                <input
                                    type="text"
                                    value={newBanner.title}
                                    onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Гарчиг оруулна уу"
                                />
                            </label>
                            <label className="block">
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Дэд гарчиг</span>
                                <input
                                    type="text"
                                    value={newBanner.subtitle}
                                    onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Дэд гарчиг оруулна уу"
                                />
                            </label>
                        </div>

                        <div>
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">Баннер зураг</span>
                            <div className="flex items-start gap-4">
                                {newBanner.image && (
                                    <div className="w-48 h-28 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                                        <img src={newBanner.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <label className="flex-1 max-w-xs h-28 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-400 hover:text-primary">
                                    <span className="material-symbols-outlined text-3xl mb-1">add_photo_alternate</span>
                                    <span className="text-xs font-bold">Зураг сонгох</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <button
                                onClick={handleCancel}
                                className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                Цуцлах
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="bg-primary hover:bg-blue-600 disabled:bg-slate-400 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                            >
                                {loading && <span className="animate-spin text-sm">↻</span>}
                                Хадгалах
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {banners.map(banner => (
                    <div key={banner.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-6 group">
                        <div className="w-40 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-900">
                            <img src={banner.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-1 truncate">{banner.title}</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{banner.subtitle}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`w-2 h-2 rounded-full ${banner.active ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    {banner.active ? 'Идэвхтэй' : 'Идэвхгүй'}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => startEdit(banner)}
                                className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-400 hover:text-primary transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button
                                onClick={() => handleDelete(banner.id)}
                                className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-400 hover:text-red-500 transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                        </div>
                    </div>
                ))}

                {banners.length === 0 && !loading && (
                    <div className="py-20 text-center bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                        <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">image</span>
                        <p className="text-slate-400 font-bold">Одоогоор баннер байхгүй байна</p>
                    </div>
                )}
            </div>
        </div>
    );
}
