

export default function Footer() {
    return (
        <footer className="mt-12 bg-white dark:bg-background-dark px-4 pt-8 pb-12 border-t border-slate-200 dark:border-slate-800">
            <div className="mb-6">
                <h2 className="text-primary font-bold text-lg mb-4">Somang Trading</h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                    Солонгос улсаас чанартай автомашин нийлүүлэгч.<br />
                    Хаяг: БНСУ, Сөүл хот, Каннам дүүрэг...<br />
                    Утас: +82 10-0000-0000
                </p>
            </div>
            <div className="flex gap-4 mb-8">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">social_leaderboard</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">mail</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">share</span>
                </div>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <a href="#">Үйлчилгээний нөхцөл</a>
                <a href="#">Нууцлалын бодлого</a>
                <a href="#">Бидний тухай</a>
            </div>
        </footer>
    );
}
