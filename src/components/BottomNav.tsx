import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path ? 'text-primary' : 'text-slate-500';
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-6 pb-6 pt-2">
            <div className="flex justify-between items-center max-w-md mx-auto">
                <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/')}`}>
                    <span className="material-symbols-outlined fill-1">home</span>
                    <span className="text-[10px] font-bold">Нүүр</span>
                </Link>
                <Link to="/search" className={`flex flex-col items-center gap-1 ${isActive('/search')}`}>
                    <span className="material-symbols-outlined">search</span>
                    <span className="text-[10px] font-bold">Хайх</span>
                </Link>
                <Link to="/saved" className={`flex flex-col items-center gap-1 ${isActive('/saved')}`}>
                    <span className="material-symbols-outlined">favorite</span>
                    <span className="text-[10px] font-bold">Хадгалсан</span>
                </Link>
                <Link to="/profile" className={`flex flex-col items-center gap-1 ${isActive('/profile')}`}>
                    <span className="material-symbols-outlined">person</span>
                    <span className="text-[10px] font-bold">Профайл</span>
                </Link>
            </div>
        </nav>
    );
}
