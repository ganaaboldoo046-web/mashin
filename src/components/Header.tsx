import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { setUser, useUser } from '../hooks/useUser';

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
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setQuery(searchParams.get('q') || '');
    }, [searchParams]);

    useEffect(() => {
        if (!menuOpen) return;
        const onClickAway = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', onClickAway);
        return () => document.removeEventListener('mousedown', onClickAway);
    }, [menuOpen]);

    const runSearch = () => navigate(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : '/search');
    const onSearchKey = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') runSearch();
    };

    const mobileTitle = title ?? MOBILE_TITLES[location.pathname] ?? '';
    const initial = user?.name?.slice(0, 1).toUpperCase() || '';

    return (
        <header className="sticky top-0 z-40 bg-surface border-b border-[#e9ebef]">
            {/* 모바일 앱 헤더 */}
            <div className="flex lg:hidden items-center gap-3 px-4 py-3">
                {showBack ? (
                    <button
                        onClick={() => navigate(-1)}
                        aria-label="Буцах"
                        className="w-9 h-9 flex-none rounded-[10px] bg-surface-4 text-ink text-base flex items-center justify-center"
                    >
                        ←
                    </button>
                ) : (
                    <Link to="/" className="flex-none">
                        <img src="/logo.png" alt="Temmun Trading" className="h-[30px] w-auto block" />
                    </Link>
                )}
                <div className="flex-1 min-w-0 text-[15.5px] font-extrabold tracking-[-0.01em] truncate">{mobileTitle}</div>
                {user ? (
                    <Link
                        to="/profile"
                        className="w-9 h-9 flex-none rounded-full bg-primary-soft text-primary text-[13px] font-extrabold flex items-center justify-center overflow-hidden"
                    >
                        {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : initial}
                    </Link>
                ) : (
                    <Link
                        to="/profile"
                        className="h-9 flex-none px-3.5 inline-flex items-center rounded-[10px] border border-line-strong bg-surface text-[13px] font-bold text-ink whitespace-nowrap"
                    >
                        Нэвтрэх
                    </Link>
                )}
            </div>

            {/* 데스크탑 헤더 */}
            <div className="hidden lg:flex max-w-shell mx-auto px-6 h-[68px] items-center gap-10">
                <Link to="/" className="flex-none">
                    <img src="/logo.png" alt="Temmun Trading" className="h-[38px] w-auto block" />
                </Link>

                <nav className="flex items-center gap-2 flex-1 min-w-0">
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

                <div className="flex items-center gap-3.5 flex-none">
                    <div className="flex items-center gap-2 h-10 px-3.5 rounded-[10px] bg-surface-4 basis-[230px] min-w-0">
                        <button onClick={runSearch} aria-label="Хайх" className="text-muted-faint text-[15px] leading-none">
                            ⌕
                        </button>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={onSearchKey}
                            placeholder="Машин хайх"
                            className="w-full min-w-0 bg-transparent border-0 outline-none text-[13.5px] font-medium text-ink placeholder:text-muted-faint"
                        />
                        {query && (
                            <button onClick={() => setQuery('')} aria-label="Цэвэрлэх" className="text-muted-faint text-[13px] leading-none">
                                ✕
                            </button>
                        )}
                    </div>

                    {user ? (
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setMenuOpen((v) => !v)}
                                className="flex items-center gap-2 h-10 pl-1.5 pr-3 rounded-[10px] border border-line bg-surface"
                            >
                                <span className="w-7 h-7 rounded-full bg-primary-soft text-primary text-[12.5px] font-extrabold flex items-center justify-center overflow-hidden">
                                    {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : initial}
                                </span>
                                <span className="text-[13.5px] font-bold text-ink whitespace-nowrap">{user.name}</span>
                                <span className="text-[10px] text-muted-faint">▾</span>
                            </button>
                            {menuOpen && (
                                <div className="absolute top-12 right-0 w-[190px] bg-surface border border-line rounded-xl shadow-pop p-1.5 z-50 flex flex-col">
                                    <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-left px-3 py-2.5 rounded-lg text-[13.5px] font-bold text-ink-soft hover:bg-surface-2">
                                        Профайл
                                    </Link>
                                    <Link to="/saved" onClick={() => setMenuOpen(false)} className="text-left px-3 py-2.5 rounded-lg text-[13.5px] font-bold text-ink-soft hover:bg-surface-2">
                                        Хадгалсан зар
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setUser(null);
                                            setMenuOpen(false);
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
                            className="h-10 px-3.5 inline-flex items-center rounded-[10px] border border-line-strong bg-surface text-[13.5px] font-bold text-ink whitespace-nowrap"
                        >
                            Нэвтрэх
                        </Link>
                    )}

                    <a
                        href="tel:01057279927"
                        className="h-10 px-4 inline-flex items-center rounded-[10px] bg-primary text-white text-[13.5px] font-bold whitespace-nowrap flex-none hover:text-white"
                    >
                        Холбоо барих
                    </a>
                </div>
            </div>
        </header>
    );
}
