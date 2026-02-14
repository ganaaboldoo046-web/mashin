import React, { useState, useEffect } from 'react';
import { getCategories, saveCategory, deleteCategory, uploadImage } from '../../utils/storage';
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

            await saveCategory(editingId ? { ...categoryData, id: editingId } : categoryData);
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

    const handleDelete = async (id: number) => {
        if (window.confirm('Энэ ангиллыг устгахдаа итгэлтэй байна уу?')) {
            try {
                await deleteCategory(id);
                const updated = await getCategories();
                setCategories(updated);
            } catch (err) {
                console.error('Delete failed:', err);
                alert('Устгахад алдаа гарлаа.');
            }
        }
    };

    const icons = ['category', 'directions_car', 'electric_car', 'local_shipping', 'sports_motorsports', 'airport_shuttle', 'agriculture', 'moped'];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ангилал удирдах</h2>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">add</span>
                        Шинэ ангилал
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-8">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                        {editingId ? 'Ангилал засах' : 'Шинэ ангилал нэмэх'}
                    </h3>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label className="block">
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Нэр</span>
                                <input
                                    type="text"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Ангиллын нэр"
                                />
                            </label>
                            <div>
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">Айкон сонгох</span>
                                <div className="flex flex-wrap gap-2">
                                    {icons.map(icon => (
                                        <button
                                            key={icon}
                                            type="button"
                                            onClick={() => setNewCategory({ ...newCategory, icon })}
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${newCategory.icon === icon ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-50 dark:bg-slate-900 text-slate-400 hover:bg-slate-100'}`}
                                        >
                                            <span className="material-symbols-outlined text-xl">{icon}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">Ангиллын зураг</span>
                            <div className="flex items-start gap-4">
                                {newCategory.image && (
                                    <div className="w-32 h-32 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                                        <img src={newCategory.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <label className="flex-1 max-w-xs h-32 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-400 hover:text-primary">
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map(cat => (
                    <div key={cat.id} className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700 group hover:border-primary transition-colors">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl">{cat.icon}</span>
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-1">{cat.name}</h4>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{cat.count} машин</p>

                            <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => startEdit(cat)}
                                    className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-400 hover:text-primary transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">edit</span>
                                </button>
                                <button
                                    onClick={() => handleDelete(cat.id)}
                                    className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
