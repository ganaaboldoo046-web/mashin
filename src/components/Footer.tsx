import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="mt-12 bg-white dark:bg-background-dark px-4 pt-8 pb-12 border-t border-slate-200 dark:border-slate-800">
            <div className="mb-6 space-y-3">
                <h2 className="text-primary font-bold text-lg mb-4">Temmun Trading</h2>
                <div className="flex items-start gap-2 text-xs text-slate-500 leading-relaxed">
                    <span className="material-symbols-outlined text-sm mt-0.5 shrink-0">location_on</span>
                    <div>
                        <p>인천 연수구 능허대로 192</p>
                        <p>192, Neungheodae-ro, Yeongsu-gu,Incheon,Republic of Korea</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 leading-relaxed">
                    <span className="material-symbols-outlined text-sm shrink-0">call</span>
                    <div className="flex gap-3">
                        <a href="tel:01057279927">010 5727 9927</a>
                        <span className="text-slate-300">|</span>
                        <a href="tel:99001979">9900 1979</a>
                    </div>
                </div>
            </div>
            <div className="flex gap-4 mb-8">
                <a
                    href="https://www.facebook.com/temmun.trading"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-[#1877F2] hover:bg-blue-50 transition-colors"
                    aria-label="Facebook"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                </a>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Link to="/terms">Үйлчилгээний нөхцөл</Link>
                <Link to="/privacy">Нууцлалын бодлого</Link>
                <Link to="/about">Бидний тухай</Link>
            </div>
        </footer>
    );
}
