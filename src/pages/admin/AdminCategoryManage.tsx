import React, { useState, useEffect } from 'react';
import { getCategories, saveCategories } from '../../utils/storage';
import type { Category } from '../../utils/storage';

export default function AdminCategoryManage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [newCategory, setNewCategory] = useState<Partial<Category>>({ name: '', icon: 'category', image: '' });

    useEffect(() => {
        setCategories(getCategories());
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
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
    };

    const handleSave = () => {
        if (!newCategory.name) return;

        let updatedCategories;
        if (editingId) {
            // Update existing
            updatedCategories = categories.map(c => c.id === editingId ? {
                ...c,
                name: newCategory.name || c.name,
                icon: newCategory.icon || c.icon,
                image: newCategory.image // Allow clearing or changing image? Logic here keeps it if in newCategory, usually assumes newCategory has current state
            } : c);
        } else {
            // Create new
            const category: Category = {
                id: Date.now(),
                name: newCategory.name,
                icon: newCategory.icon || 'category',
                image: newCategory.image,
                count: 0
            };
            updatedCategories = [...categories, category];
        }

        setCategories(updatedCategories);
        saveCategories(updatedCategories);

        handleCancel();
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Энэ ангиллыг устгах уу? (Delete this category?)')) {
            const updatedCategories = categories.filter(c => c.id !== id);
            setCategories(updatedCategories);
            saveCategories(updatedCategories);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ангилал</h2>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-primary hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/30 transition-all"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Ангилал нэмэх
                    </button>
                )}
            </div>

            {/* Add/Edit Category Form */}
            {isAdding && (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-8 animate-fade-in">
                    <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">
                        {editingId ? 'Ангилал засах' : 'Шинэ ангилал нэмэх'}
                    </h3>
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Image Upload */}
                        <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center relative overflow-hidden group hover:border-primary transition-colors cursor-pointer shrink-0">
                            {newCategory.image ? (
                                <>
                                    <img src={newCategory.image} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => setNewCategory({ ...newCategory, image: '' })}
                                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <span className="material-symbols-outlined text-white">delete</span>
                                    </button>
                                </>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                                    <span className="material-symbols-outlined text-2xl text-slate-400 group-hover:text-primary">add_photo_alternate</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            )}
                        </div>

                        <div className="flex-1 space-y-4">
                            <label className="block">
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Ангиллын нэр</span>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="Жишээ: Жийп"
                                    value={newCategory.name}
                                    onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                                />
                            </label>
                            <label className="block">
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Айкон (Google Font Material Symbols)</span>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="category"
                                    value={newCategory.icon}
                                    onChange={e => setNewCategory({ ...newCategory, icon: e.target.value })}
                                />
                                <p className="text-xs text-slate-400 mt-1">Зураг байхгүй үед харагдана.</p>
                            </label>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    onClick={handleCancel}
                                    className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                                >
                                    Болих
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2.5 rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/30 hover:bg-blue-600 transition-all"
                                >
                                    {editingId ? 'Шинэчлэх' : 'Хадгалах'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase font-bold text-xs">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Нэр</th>
                                <th className="px-6 py-4">Айкон/Зураг</th>
                                <th className="px-6 py-4">Машины тоо</th>
                                <th className="px-6 py-4 text-right">Үйлдэл</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {categories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-4 text-slate-500">#{cat.id}</td>
                                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{cat.name}</td>
                                    <td className="px-6 py-4">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                                            {cat.image ? (
                                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="material-symbols-outlined text-gray-400 text-sm">{cat.icon}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{cat.count}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => startEdit(cat)}
                                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
                                            >
                                                <span className="material-symbols-outlined text-base">edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id)}
                                                className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg text-slate-500"
                                            >
                                                <span className="material-symbols-outlined text-base">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        Ангилал байхгүй байна
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
