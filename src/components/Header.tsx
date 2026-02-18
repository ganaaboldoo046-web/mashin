import { useState } from 'react';
import { Link } from 'react-router-dom';
import SideMenu from './SideMenu';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-50 flex items-center bg-white dark:bg-background-dark px-4 py-3 justify-between border-b border-slate-200 dark:border-slate-800">
                {/* Logo Image */}
                <div className="flex-1 flex items-center justify-start">
                    <Link to="/" className="inline-block">
                        <img src="/logo.png" alt="Temmun Trading" className="h-10 object-contain" />
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-white"
                    >
                        <span className="material-symbols-outlined text-2xl">menu</span>
                    </button>
                </div>
            </header>

            {/* Side Menu Drawer */}
            <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    );
}
