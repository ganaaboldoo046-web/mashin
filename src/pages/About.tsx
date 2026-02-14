import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';

export default function About() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black font-sans pb-20">
            <Header />

            <main className="container mx-auto px-4 py-6 max-w-lg md:max-w-2xl">
                {/* Header Removed */}

                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden mb-6">
                    <img src="/about.jpg" alt="About Temmun Trading" className="w-full h-auto object-cover" />
                    <div className="p-6">
                        {/* Title Removed */}
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                            Бид Солонгос улсаас чанартай автомашинуудыг найдвартай, хурдан шуурхай нийлүүлдэг.
                        </p>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                            <li className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">check_circle</span>
                                Баталгаат чанар
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">check_circle</span>
                                Шилдэг үйлчилгээ
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">check_circle</span>
                                Найдвартай түншлэл
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">Холбоо барих</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-slate-400">location_on</span>
                            <span className="text-slate-600 dark:text-slate-300">
                                БНСУ, Сөүл хот, Каннам дүүрэг, Техеран-ро 123
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-slate-400">call</span>
                            <a href="tel:+821000000000" className="text-primary font-medium hover:underline">
                                +82 10-0000-0000
                            </a>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-slate-400">mail</span>
                            <a href="mailto:info@temmuntrading.com" className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">
                                info@temmuntrading.com
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            <BottomNav />
            <Footer />
        </div>
    );
}
