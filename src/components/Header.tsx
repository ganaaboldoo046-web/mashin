import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import MenuDrawer from './MenuDrawer';
import { setUser, useUser } from '../hooks/useUser';
import { useExchangeRate } from '../hooks/useExchangeRate';

const MOBILE_TITLES: Record<string, string> = {
    '/': '',
    '/search': 'Автомашин',
    '/saved': 'Хадгалсан зар',
    '/profile': 'Профайл',
    '/about': 'Бидний тухай',
    '/terms': 'Үйлчилгээний нөхцөл',
    '/privacy': 'Нууцлалын бодлого',
};

const NAV_ITEMS = [
    { to: '/', label: 'Нүүр', end: true },
    { to: '/search', label: 'Автомашин', end: false },
    { to: '/about', label: 'Бидний тухай', end: false },
];

const iconButton = 'w-9 h-9 flex-none rounded-[10px] bg-line text-ink text-[15px] flex items-center justify-center';

interface HeaderProps {
    /** Detail-style header: back arrow instead of the logo. */
    showBack?: boolean;
    title?: string;
}

export default function Header({ showBack = false, title }: HeaderProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const user = useUser();
    const rate = useExchangeRate();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const nextQuery = searchParams.get('q') || '';
        queueMicrotask(() => setQuery(nextQuery));
    }, [searchParams]);

    useEffect(() => {
        if (!userMenuOpen) return;
        const onClickAway = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
        };
        document.addEventListener('mousedown', onClickAway);
        return () => document.removeEventListener('mousedown', onClickAway);
    }, [userMenuOpen]);

    const runSearch = () => navigate(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : '/search');
    const onSearchKey = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') runSearch();
    };

    // Keep titles on detail-style back headers, but leave the area beside the
    // logo clear on regular mobile pages.
    const mobileTitle = showBack ? (title ?? MOBILE_TITLES[location.pathname] ?? '') : '';
    const initial = user?.name?.slice(0, 1).toUpperCase() || '';

    return (
        <>
            <header className="sticky top-0 z-40 bg-surface border-b border-line">
                {/* 모바일 앱 헤더 */}
                <div className="flex lg:hidden items-center gap-3 px-4 py-3">
                    {showBack ? (
                        <button onClick={() => navigate(-1)} aria-label="Буцах" className={iconButton}>
                            ←
                        </button>
                    ) : (
                        <Link to="/" className="flex-none">
                            <img src="/logo.webp" alt="DT Trading" width="220" height="117" className="h-[30px] w-auto block" />
                        </Link>
                    )}
                    <div className="flex-1 min-w-0 text-[15.5px] font-extrabold tracking-[-0.01em] truncate">{mobileTitle}</div>
                    {user ? (
                        <Link
                            to="/profile"
                            className="w-9 h-9 flex-none rounded-full bg-primary-soft text-primary text-[13px] font-extrabold flex items-center justify-center overflow-hidden"
                        >
                            {user.avatar ? <img src={user.avatar} alt={user.name} width="36" height="36" className="w-full h-full object-cover" /> : initial}
                        </Link>
                    ) : (
                        <Link
                            to="/profile"
                            className="h-9 flex-none px-3.5 inline-flex items-center rounded-[10px] border border-line bg-surface text-[13px] font-bold text-ink whitespace-nowrap"
                        >
                            Нэвтрэх
                        </Link>
                    )}
                    <button onClick={() => setMenuOpen(true)} aria-label="Цэс" className={iconButton}>
                        ☰
                    </button>
                </div>

                {/* 데스크탑 헤더 */}
                <div className="hidden lg:flex max-w-shell mx-auto px-6 h-[68px] items-center gap-5">
                    <Link to="/" className="flex-none">
                        <img src="/logo.webp" alt="DT Trading" width="220" height="117" className="h-[38px] w-auto block" />
                    </Link>

                    <nav className="flex items-center gap-0.5 flex-none">
                        {NAV_ITEMS.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) =>
                                    `px-3 py-2 rounded-lg text-[14.5px] whitespace-nowrap transition-colors ${
                                        isActive ? 'font-extrabold text-ink' : 'font-semibold text-muted hover:text-ink'
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2.5 flex-1 min-w-0 justify-end">
                        <div className="flex items-center gap-2 h-10 px-3.5 rounded-[10px] bg-surface-2 border border-line basis-[230px] min-w-0">
                            <button onClick={runSearch} aria-label="Хайх" className="text-muted-soft text-[15px] leading-none">
                                ⌕
                            </button>
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={onSearchKey}
                                placeholder="Машин хайх"
                                className="w-full min-w-0 bg-transparent border-0 outline-none text-[13.5px] font-medium text-ink placeholder:text-muted-soft"
                            />
                            {query && (
                                <button onClick={() => setQuery('')} aria-label="Цэвэрлэх" className="text-muted-soft text-[13px] leading-none">
                                    ✕
                                </button>
                            )}
                        </div>

                        {user ? (
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setUserMenuOpen((v) => !v)}
                                    className="flex items-center gap-2 h-10 pl-1.5 pr-3 rounded-[10px] border border-line bg-surface"
                                >
                                    <span className="w-7 h-7 rounded-full bg-primary-soft text-primary text-[12.5px] font-extrabold flex items-center justify-center overflow-hidden">
                                        {user.avatar ? <img src={user.avatar} alt={user.name} width="28" height="28" className="w-full h-full object-cover" /> : initial}
                                    </span>
                                    <span className="text-[13.5px] font-bold text-ink whitespace-nowrap">{user.name}</span>
                                    <span className="text-[10px] text-muted-soft">▾</span>
                                </button>
                                {userMenuOpen && (
                                    <div className="absolute top-12 right-0 w-[190px] bg-surface border border-line rounded-xl shadow-pop p-1.5 z-50 flex flex-col">
                                        <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="text-left px-3 py-2.5 rounded-lg text-[13.5px] font-bold text-ink-soft hover:bg-surface-2">
                                            Профайл
                                        </Link>
                                        <Link to="/saved" onClick={() => setUserMenuOpen(false)} className="text-left px-3 py-2.5 rounded-lg text-[13.5px] font-bold text-ink-soft hover:bg-surface-2">
                                            Хадгалсан зар
                                        </Link>
                                        <button
                                            onClick={async () => {
                                                await fetch('/api/user_logout', { method: 'POST' }).catch(() => undefined);
                                                setUser(null);
                                                setUserMenuOpen(false);
                                            }}
                                            className="text-left px-3 py-2.5 rounded-lg text-[13.5px] font-bold text-danger hover:bg-surface-2"
                                        >
                                            Гарах
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/profile"
                                className="h-10 px-3.5 inline-flex items-center rounded-[10px] border border-line bg-surface text-[13.5px] font-bold text-ink whitespace-nowrap"
                            >
                                Нэвтрэх
                            </Link>
                        )}

                        {/* 오늘 환율 배지 */}
                        <div className="h-10 px-4 inline-flex items-center rounded-[10px] bg-primary text-white text-[13px] font-bold whitespace-nowrap flex-none">
                            1₩ = ₮{rate}
                        </div>
                    </div>
                </div>
            </header>

            <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
        </>
    );
}
