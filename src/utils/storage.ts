
export interface Banner {
    id: number;
    title: string;
    subtitle: string;
    image: string;
    active: boolean;
    bg?: string;
}

export interface Category {
    id: number;
    name: string;
    icon: string;
    image?: string;
    count: number;
}

export interface Product {
    id: number;
    name: string;
    price: string;
    priceKRW?: number;
    year: string;
    mileage: string;
    fuel: string;
    images: string[];
    options?: string[];
    tags: string[];
    status: 'active' | 'sold' | 'pending' | 'discounted';
    description: string;
    categoryId: number;
    engine?: string;
    transmission?: string;
    drive?: string;
    color?: string;
    interiorColor?: string;
    doors?: string;
    isFeatured?: boolean;
}

export interface ExchangeRate {
    krwToMnt: number; // 1 KRW = X MNT
    lastUpdated: string;
}

export const initialExchangeRate: ExchangeRate = {
    krwToMnt: 2.5, // Default example rate
    lastUpdated: new Date().toISOString()
};


// API Base URL (empty string for relative path in Pages)
const API_BASE = '/api';

export const initialBanners: Banner[] = [
    {
        id: 1,
        title: 'Урамшуулал',
        subtitle: 'Өвлийн онцгой хямдрал эхэллээ!',
        image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80',
        active: true,
        bg: 'from-black/60'
    }
];

export const initialCategories: Category[] = [
    { id: 1, name: 'СУУДЛЫН ТЭРЭГ', icon: 'directions_car', count: 120, image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80' },
    { id: 2, name: 'ЖИЙП', icon: 'airport_shuttle', count: 85, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1bcfb0?auto=format&fit=crop&q=80' }
];

// Local Storage Keys for non-DB data
export const STORAGE_KEYS = {
    EXCHANGE_RATE: 'somang_exchange_rate',
    SAVED: 'somang_saved',
    RECENT: 'somang_recent',
};

// --- API Functions (Async) ---

export const getBanners = async (): Promise<Banner[]> => {
    try {
        const res = await fetch(`${API_BASE}/banners`);
        if (!res.ok) throw new Error('Failed to fetch banners');
        const data = await res.json();
        // Return empty array if DB is empty, don't fallback to initialBanners after first setup
        return data.map((b: any) => ({
            ...b,
            active: b.active === 1
        }));
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const saveBanner = async (banner: Partial<Banner>) => {
    const res = await fetch(`${API_BASE}/banners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(banner)
    });
    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to save banner');
    }
    return res.json();
};

export const deleteBanner = async (id: number) => {
    const res = await fetch(`${API_BASE}/banners_delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });
    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to delete banner');
    }
    return res.json();
};

export const getCategories = async (): Promise<Category[]> => {
    try {
        const res = await fetch(`${API_BASE}/categories`);
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const createCategory = async (category: Partial<Category>) => {
    const res = await fetch(`${API_BASE}/categories_create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
    });
    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to save category');
    }
    return res.json();
};

export const reorderCategories = async (ids: number[]) => {
    const res = await fetch(`${API_BASE}/categories_reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
    });
    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to reorder categories');
    }
    return res.json();
};

export const saveCategory = createCategory;

export const deleteCategory = async (id: number) => {
    const res = await fetch(`${API_BASE}/categories_delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });
    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to delete category');
    }
    return res.json();
};

export const getProducts = async (): Promise<Product[]> => {
    try {
        const res = await fetch(`${API_BASE}/products`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        if (!Array.isArray(data)) return [];
        return data.map((p: any) => ({
            ...p,
            images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
            options: p.options ? (typeof p.options === 'string' ? JSON.parse(p.options) : p.options) : [],
            isFeatured: p.isFeatured === 1,
            tags: [p.year, p.fuel].filter(Boolean)
        }));
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const saveProduct = async (product: Omit<Product, 'id'>) => {
    const res = await fetch(`${API_BASE}/products_create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to save product');
    }
    return res.json();
};

// Alias for plural for backward compatibility if needed by mistake, but better to fix callers
export const saveProducts = saveProduct;

export const deleteProduct = async (id: number) => {
    const res = await fetch(`${API_BASE}/products_delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });
    return res.json();
};

export const uploadImage = async (blob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append('file', blob);
    const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData
    });
    if (!res.ok) throw new Error('Failed to upload image');
    const data = await res.json();
    return data.url;
};

// --- Local Storage Functions (Sync) ---

export const getExchangeRate = (): ExchangeRate => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.EXCHANGE_RATE);
        return stored ? JSON.parse(stored) : initialExchangeRate;
    } catch (e) {
        return initialExchangeRate;
    }
};

export const saveExchangeRate = (rate: ExchangeRate) => {
    localStorage.setItem(STORAGE_KEYS.EXCHANGE_RATE, JSON.stringify(rate));
    window.dispatchEvent(new Event('exchangeRateUpdated'));
};

export const getSavedIds = (): number[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.SAVED);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};

export const toggleSaved = (id: number): boolean => {
    const saved = getSavedIds();
    const index = saved.indexOf(id);
    const newSaved = index === -1 ? [...saved, id] : saved.filter(itemId => itemId !== id);
    localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(newSaved));
    window.dispatchEvent(new Event('storageSaved'));
    return index === -1;
};

export const isSaved = (id: number): boolean => getSavedIds().includes(id);

export const getRecentlyViewedIds = (): number[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.RECENT);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};

export const addToRecentlyViewed = (id: number) => {
    const recent = getRecentlyViewedIds();
    const newRecent = [id, ...recent.filter(itemId => itemId !== id)].slice(0, 20);
    localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(newRecent));
    window.dispatchEvent(new Event('storageRecent'));
};
