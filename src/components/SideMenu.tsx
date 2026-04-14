import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
    const navigate = useNavigate();
    const location = useLocation();

    // Close menu when route changes
    useEffect(() => {
        onClose();
    }, [location.pathname]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleNavigate = (path: string) => {
        navigate(path);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[60] flex justify-end overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 transition-opacity animate-fade-in"
                onClick={onClose}
            />

            {/* Menu Drawer - Right Side */}
            <div className="relative w-72 h-full bg-white dark:bg-slate-900 shadow-2xl animate-slide-in-right flex flex-col">
                <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                    <h2 className="font-bold text-lg text-slate-900 dark:text-white">Цэс</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                    <MenuItem icon="home" label="Нүүр хуудас" onClick={() => handleNavigate('/')} />
                    <MenuItem icon="grid_view" label="Ангилал" onClick={() => handleNavigate('/category/1')} />
                    <MenuItem icon="favorite" label="Хадгалсан" onClick={() => handleNavigate('/saved')} />
                    <MenuItem icon="person" label="Профайл" onClick={() => handleNavigate('/profile')} />

                </div>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <p className="text-xs text-center text-slate-400">© 2026 Temmun Trading</p>
                </div>
            </div>
        </div>
    );
}

function MenuItem({ icon, label, onClick }: { icon: string, label: string, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-4 w-full p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all active:scale-[0.98]"
        >
            <span className="material-symbols-outlined text-slate-400">{icon}</span>
            <span className="font-medium text-sm">{label}</span>
        </button>
    );
}
