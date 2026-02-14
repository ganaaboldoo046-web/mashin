import { useNavigate, useParams } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

export default function CategoryDetail() {
    const navigate = useNavigate();
    const { id } = useParams();

    // Mock title based on ID (In real app, fetch from API)
    const getTitle = () => {
        switch (id) {
            case '1': return 'Бага оврын';
            case '2': return 'Дунд оврын';
            case '3': return 'Ачааны';
            case '4': return 'Жийп';
            default: return 'Машин';
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen font-display text-slate-900 dark:text-slate-100 pb-20">
            {/* Header Section */}
            <header className="sticky top-0 z-50 bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 px-4 py-3">
                <div className="flex items-center justify-between max-w-xl mx-auto">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-900 dark:text-white"
                        >
                            <span className="material-symbols-outlined block">arrow_back</span>
                        </button>
                        <h1 className="text-lg font-bold tracking-tight">{getTitle()}</h1>
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <span className="material-symbols-outlined block">search</span>
                        </button>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <span className="material-symbols-outlined block">tune</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-xl mx-auto">
                {/* Search & Quick Filters */}
                <div className="px-4 py-4">
                    <div className="relative mb-4">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                        <input
                            className="w-full bg-white dark:bg-slate-800 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary shadow-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                            placeholder="Машин хайх..."
                            type="text"
                        />
                    </div>
                    {/* Horizontal Filter Chips */}
                    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 no-scrollbar">
                        <button className="flex items-center gap-1 shrink-0 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium">
                            <span>Бүгд</span>
                        </button>
                        <button className="flex items-center gap-1 shrink-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-medium">
                            <span>Үнэ</span>
                            <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                        </button>
                        <button className="flex items-center gap-1 shrink-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-medium">
                            <span>Он</span>
                            <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                        </button>
                        <button className="flex items-center gap-1 shrink-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-medium">
                            <span>Гүйлт</span>
                            <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                        </button>
                    </div>
                </div>

                {/* Car Listings */}
                <div className="px-4">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Нийт 42 автомашин олдлоо</p>
                        <button className="text-primary text-sm font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">swap_vert</span>
                            Эрэмбэлэх
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div key={item} onClick={() => navigate('/product/1')} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col p-2 cursor-pointer border border-slate-100 dark:border-slate-700">
                                <div className="relative aspect-square w-full mb-2">
                                    <img
                                        alt="Hyundai Accent"
                                        className="w-full h-full object-cover rounded-lg"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKOzEepacXi-e39s5Tp-ZT153_A8_yPDriEWhkM7S3dMN8h6uswn-6sJCBNom-RROedLoLCudKYmAsInFPfq_o5F93Gi9fr3Ned0XDVks7EKLDwxh30XeG8o5DTenFoCoMzVprDgFFFZqacwOGxlmSTBytiy2j8ZHL_dk9B5McTWqN8MqGwYsKXqWS6UU2dbqVdSR0Fa4fQuXVy0sBu3rBcnd8xHxl2xz1pPqRVtgNL7iX38pl5ZJhVGX79UuZMkHVeyNBw0Of1Q8"
                                    />
                                    <button className="absolute top-1 right-1 w-7 h-7 bg-white/80 dark:bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-700 dark:text-white">
                                        <span className="material-symbols-outlined text-base">favorite</span>
                                    </button>
                                    <div className="absolute bottom-1 left-1 bg-primary px-1.5 py-0.5 rounded text-[9px] font-bold text-white uppercase">
                                        Бэлэн
                                    </div>
                                </div>
                                <div className="px-1 flex-grow flex flex-col">
                                    <h3 className="font-bold text-[13px] leading-tight mb-0.5 text-slate-900 dark:text-white">Hyundai Accent</h3>
                                    <div className="text-[10px] text-slate-400 dark:text-slate-500 mb-1.5">
                                        <span>2018 • 45,000 км</span>
                                    </div>
                                    <span className="text-primary font-bold text-sm mt-auto">28.5 сая ₮</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
