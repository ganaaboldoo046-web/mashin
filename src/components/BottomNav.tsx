import { Link, useLocation } from 'react-router-dom';

// ︎ = text presentation selector, so ☺ stays a monochrome glyph instead of a color emoji.
const TABS = [
    { to: '/', label: 'Нүүр', icon: '⌂' },
    { to: '/search', label: 'Хайх', icon: '⌕' },
    { to: '/saved', label: 'Хадгалсан', icon: '♡' },
    { to: '/profile', label: 'Профайл', icon: '☺︎' },
];

/** 모바일 전용 하단 탭바. 데스크탑은 헤더 내비게이션을 사용한다. */
export default function BottomNav() {
    const { pathname } = useLocation();

    return (
        <nav className="lg:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app z-30 bg-white/[0.97] backdrop-blur-lg border-t border-line px-3 pt-2 pb-[18px] flex box-border">
            {TABS.map((tab) => {
                const active = pathname === tab.to;
                return (
                    <Link
                        key={tab.to}
                        to={tab.to}
                        className={`flex-1 flex flex-col items-center gap-[3px] min-h-12 py-1.5 ${active ? 'text-primary' : 'text-muted-faint'}`}
                    >
                        <span className="text-[19px] leading-none">{tab.icon}</span>
                        <span className="text-[10.5px] font-bold">{tab.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
