import { useEffect, useState } from 'react';
import { type Banner as BannerType, getBanners } from '../utils/storage';

export default function Banner() {
    const [banners, setBanners] = useState<BannerType[]>([]);

    // Fallback images if storage is empty or fails
    const defaultBanners: BannerType[] = [
        {
            id: 1,
            title: "Шилдэг автомашинуудыг эндээс",
            subtitle: "Тансаг зэрэглэлийн автомашины сонголт",
            image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
            active: true,
            bg: "from-blue-900/60"
        },
        // ... more defaults if needed
    ];

    useEffect(() => {
        const loadBanners = () => {
            const allBanners = getBanners();
            // If no banners in storage, use default for display (though getBanners usually handles this)
            if (allBanners.length === 0) {
                setBanners(defaultBanners);
            } else {
                setBanners(allBanners.filter(b => b.active !== false));
            }
        };

        loadBanners();

        window.addEventListener('bannersUpdated', loadBanners);
        return () => window.removeEventListener('bannersUpdated', loadBanners);
    }, []);

    if (banners.length === 0) return null;

    return (
        <section className="mb-6 overflow-hidden">
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar no-scrollbar px-4 pb-4">
                {banners.map((banner) => (
                    // Removing min-w, using fixed width + flex-shrink-0 to ensure exact sizing
                    <div
                        key={banner.id}
                        className="relative w-[85%] md:w-[60%] h-48 md:h-80 rounded-2xl overflow-hidden shadow-lg snap-center shrink-0 flex-none bg-slate-200 dark:bg-slate-800"
                    >
                        <img
                            className="w-full h-full object-cover"
                            src={banner.image}
                            alt={banner.title}
                            onError={(e) => {
                                // Fallback if image fails to load
                                e.currentTarget.src = "https://via.placeholder.com/800x400?text=No+Image";
                            }}
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${banner.bg || 'from-black/60'} to-transparent flex flex-col justify-end p-5`}>
                            <h2 className="text-white text-xl md:text-3xl font-bold mb-1">{banner.title}</h2>
                            <p className="text-white/80 text-xs md:text-sm">{banner.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>
            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 -mt-2">
                {banners.map((_, index) => (
                    <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'}`}
                    />
                ))}
            </div>
        </section>
    );
}
