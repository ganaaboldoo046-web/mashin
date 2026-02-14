import React, { useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin) {
            navigate('/admin/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        navigate('/admin/login');
    };

    return (
        <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900 font-display">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-background-dark border-r border-slate-200 dark:border-slate-800 flex-col transition-transform duration-300 ease-in-out md:translate-x-0
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                flex
            `}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
                    <h1 className="text-xl font-bold text-primary">Somang Admin</h1>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="md:hidden text-slate-500"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <AdminNavLink to="/admin" end icon="dashboard" onClick={() => setIsMobileMenuOpen(false)}>Хяналтын самбар</AdminNavLink>
                    <AdminNavLink to="/admin/products" icon="directions_car" onClick={() => setIsMobileMenuOpen(false)}>Автомашин</AdminNavLink>
                    <AdminNavLink to="/admin/banners" icon="collections" onClick={() => setIsMobileMenuOpen(false)}>Баннер</AdminNavLink>
                    <AdminNavLink to="/admin/categories" icon="category" onClick={() => setIsMobileMenuOpen(false)}>Ангилал</AdminNavLink>
                    <AdminNavLink to="/admin/exchange-rate" icon="currency_exchange" onClick={() => setIsMobileMenuOpen(false)}>Ханш</AdminNavLink>
                </nav>
                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 w-full text-left text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <span className="font-medium">Гарах</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 md:px-8">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="md:hidden text-slate-500"
                    >
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <div className="flex items-center gap-4 ml-auto">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">A</div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

function AdminNavLink({ to, children, icon, end = false, onClick }: { to: string, children: React.ReactNode, icon: string, end?: boolean, onClick?: () => void }) {
    return (
        <NavLink
            to={to}
            end={end}
            onClick={onClick}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                    ? 'bg-primary text-white font-bold shadow-md shadow-primary/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium'
                }`
            }
        >
            <span className="material-symbols-outlined">{icon}</span>
            <span>{children}</span>
        </NavLink>
    );
}
