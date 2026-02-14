
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

export const initialBanners: Banner[] = [
    {
        id: 1,
        title: 'Урамшуулал',
        subtitle: 'Өвлийн онцгой хямдрал эхэллээ!',
        image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80',
        active: true,
        bg: 'from-black/60'
    },
    {
        id: 2,
        title: 'Шинэ загварууд',
        subtitle: '2025 оны шинэ машинууд ирлээ',
        image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80',
        active: true,
        bg: 'from-blue-900/60'
    }
];

export const initialCategories: Category[] = [
    { id: 1, name: 'СУУДЛЫН ТЭРЭГ', icon: 'directions_car', count: 120, image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80' },
    { id: 2, name: 'ЖИЙП', icon: 'airport_shuttle', count: 85, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1bcfb0?auto=format&fit=crop&q=80' },
    { id: 3, name: 'ПРИУС', icon: 'electric_car', count: 240, image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80' },
    { id: 4, name: 'АЧААНЫ ТЭРЭГ', icon: 'local_shipping', count: 45, image: 'https://images.unsplash.com/photo-1586191582156-ed10427c2f6d?auto=format&fit=crop&q=80' },
    { id: 5, name: 'БУСАД', icon: 'more_horiz', count: 12 }
];

export const initialProducts: Product[] = [
    {
        id: 1,
        name: 'Hyundai Santa Fe',
        price: '21.3 сая ₮',
        year: '2023',
        mileage: '12,000 км',
        fuel: 'Diesel',
        images: ['https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80'],
        tags: ['2023', 'Diesel'],
        status: 'active',
        description: 'Маш сайн нөхцөлтэй, шинээрээ шахуу.',
        categoryId: 2,
        // Detailed specifications
        engine: '2.2L Turbo Diesel',
        transmission: '8-Speed Automatic',
        drive: 'HTRAC AWD',
        color: 'Stormy Sea',
        interiorColor: 'Black Leather',
        doors: '5',
        isFeatured: true
    },
    {
        id: 2,
        name: 'Toyota Prius 41',
        price: '18.5 сая ₮',
        year: '2016',
        mileage: '85,000 км',
        fuel: 'Hybrid',
        images: ['https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80'],
        tags: ['2016', 'Hybrid'],
        status: 'active',
        description: 'Тоёота приус 41 зарна. Сайн ярьж өгнө.',
        categoryId: 3,
        engine: '1.8L Hybrid',
        transmission: 'CVT',
        drive: 'FWD',
        color: 'Pearl White',
        interiorColor: 'Grey Cloth',
        doors: '5',
        isFeatured: false
    },
    {
        id: 3,
        name: 'Kia Sorento',
        price: '25.0 сая ₮',
        year: '2020',
        mileage: '45,000 км',
        fuel: 'Diesel',
        images: ['https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80'],
        tags: ['2020', 'Diesel'],
        status: 'sold',
        description: 'Зарагдсан.',
        categoryId: 2,
        engine: '2.2L Diesel',
        transmission: 'Automatic',
        drive: 'AWD',
        color: 'Black',
        interiorColor: 'Beige Leather',
        doors: '5',
        isFeatured: true
    },
    {
        id: 4,
        name: 'Toyota Camry',
        price: '28.0 сая ₮',
        year: '2019',
        mileage: '30,000 км',
        fuel: 'Petrol',
        images: ['https://images.unsplash.com/photo-1621007947382-bb3c3968e3bf?auto=format&fit=crop&q=80'],
        tags: ['2019', 'Petrol'],
        status: 'pending',
        description: 'Ирж байгаа.',
        categoryId: 1,
        engine: '2.5L Petrol',
        transmission: 'Automatic',
        drive: 'FWD',
        color: 'Silver',
        interiorColor: 'Black',
        doors: '4',
        isFeatured: false
    }
];

export const STORAGE_KEYS = {
    BANNERS: 'somang_banners',
    CATEGORIES: 'somang_categories',
    PRODUCTS: 'somang_products',
    EXCHANGE_RATE: 'somang_exchange_rate',
};

// Helper Functions
export const getBanners = (): Banner[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.BANNERS);
        return stored ? JSON.parse(stored) : initialBanners;
    } catch (e) {
        return initialBanners;
    }
};

export const saveBanners = (banners: Banner[]) => {
    localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(banners));
    window.dispatchEvent(new Event('storageBanners'));
};

export const getCategories = (): Category[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
        return stored ? JSON.parse(stored) : initialCategories;
    } catch (e) {
        return initialCategories;
    }
};

export const saveCategories = (categories: Category[]) => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    window.dispatchEvent(new Event('storageCategories'));
};

export const getProducts = (): Product[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
        return stored ? JSON.parse(stored) : initialProducts;
    } catch (e) {
        return initialProducts;
    }
};

export const saveProducts = (products: Product[]) => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    window.dispatchEvent(new Event('storageProducts'));
};

export const getExchangeRate = (): ExchangeRate => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.EXCHANGE_RATE);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error("Failed to load exchange rate", e);
    }
    return initialExchangeRate;
};

export const saveExchangeRate = (rate: ExchangeRate) => {
    try {
        localStorage.setItem(STORAGE_KEYS.EXCHANGE_RATE, JSON.stringify(rate));

        // Recalculate prices for all products
        const products = getProducts();
        const updatedProducts = products.map(p => {
            if (p.priceKRW) {
                // Calculate new MNT price: KRW * Rate
                // Format: "XX.X сая ₮" or similar simplified format for now
                const mntPrice = p.priceKRW * rate.krwToMnt;
                const formatted = (mntPrice / 1000000).toFixed(1) + " сая ₮";
                return { ...p, price: formatted };
            }
            return p;
        });
        saveProducts(updatedProducts);

        window.dispatchEvent(new Event('exchangeRateUpdated'));
    } catch (e) {
        console.error("Failed to save exchange rate", e);
    }
};

// Saved Items (Wishlist)
export const getSavedIds = (): number[] => {
    try {
        const stored = localStorage.getItem('somang_saved');
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};

export const toggleSaved = (id: number): boolean => {
    const saved = getSavedIds();
    const index = saved.indexOf(id);
    let newSaved;
    let isNowSaved = false;

    if (index === -1) {
        newSaved = [...saved, id];
        isNowSaved = true;
    } else {
        newSaved = saved.filter(itemId => itemId !== id);
        isNowSaved = false;
    }

    localStorage.setItem('somang_saved', JSON.stringify(newSaved));
    window.dispatchEvent(new Event('storageSaved'));
    return isNowSaved;
};

export const isSaved = (id: number): boolean => {
    const saved = getSavedIds();
    return saved.includes(id);
};

// Recently Viewed Items
export const getRecentlyViewedIds = (): number[] => {
    try {
        const stored = localStorage.getItem('somang_recent');
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};

export const addToRecentlyViewed = (id: number) => {
    const recent = getRecentlyViewedIds();
    // Remove if already exists to move it to the top (front)
    const filtered = recent.filter(itemId => itemId !== id);
    // Add to beginning, limit to 20 items
    const newRecent = [id, ...filtered].slice(0, 20);

    localStorage.setItem('somang_recent', JSON.stringify(newRecent));
    window.dispatchEvent(new Event('storageRecent'));
};
