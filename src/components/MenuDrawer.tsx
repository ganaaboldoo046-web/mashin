import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setUser, useUser } from '../hooks/useUser';
import { DT_CONTACT } from '../constants/contact';

const GROUPS = [
    {
        title: 'ҮЙЛЧИЛГЭЭ',
        items: [
            { label: 'Машин үзэх', to: '/search' },
            { label: 'Хадгалсан зар', to: '/saved' },
            { label: 'Профайл', to: '/profile' },
        ],
    },
    {
        title: 'КОМПАНИ',
        items: [{ label: 'Бидний тухай', to: '/about' }],
    },
    {
        title: 'ЭРХ ЗҮЙ',
        items: [
            { label: 'Үйлчилгээний нөхцөл', to: '/terms' },
            { label: 'Нууцлалын бодлого', to: '/privacy' },
        ],
    },
];

interface MenuDrawerProps {
    open: boolean;
    onClose: () => void;
}

/** 헤더 ☰ 로 여는 전체 화면 메뉴. */
export default function MenuDrawer({ open, onClose }: MenuDrawerProps) {
    const user = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    if (!open) return null;

    const initial = user?.name?.slice(0, 1).toUpperCase() || '';

    return (
        <div className="fixed inset-0 z-[80] bg-[var(--overlay)] flex items-start justify-center" onClick={onClose}>
            <div
                className="w-full max-w-app max-h-full overflow-y-auto bg-surface flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-line">
                    <Link to="/" onClick={onClose}>
                        <img src="/logo.png" alt="DT Trading" className="h-[30px] w-auto block" />
                    </Link>
                    <button onClick={onClose} aria-label="Хаах" className="w-9 h-9 rounded-[10px] bg-line text-muted text-[15px]">
                        ✕
                    </button>
                </div>

                <div className="p-4">
                    {user ? (
                        <div className="flex items-center gap-3 px-0.5 py-1.5">
                            <div className="w-11 h-11 rounded-full bg-primary-soft text-primary flex items-center justify-center text-base font-extrabold overflow-hidden">
                                {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : initial}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-[15px] font-extrabold truncate">{user.name}</div>
                                <div className="mt-0.5 text-[12.5px] text-muted truncate">{user.email}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-2.5">
                            <button
                                onClick={() => {
                                    onClose();
                                    navigate('/profile');
                                }}
                                className="flex-1 h-12 rounded-xl bg-primary text-white text-sm font-bold"
                            >
                                Нэвтрэх
                            </button>
                            <button
                                onClick={() => {
                                    onClose();
                                    navigate('/profile');
                                }}
                                className="flex-1 h-12 rounded-xl border border-line bg-surface text-ink text-sm font-bold"
                            >
                                Бүртгүүлэх
                            </button>
                        </div>
                    )}
                </div>

                {GROUPS.map((group) => (
                    <div key={group.title} className="px-4 pt-2 pb-1">
                        <div className="text-[11.5px] font-extrabold tracking-[0.08em] text-muted-soft px-0.5 py-2">{group.title}</div>
                        <div className="flex flex-col">
                            {group.items.map((item) => (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    onClick={onClose}
                                    className="flex items-center justify-between min-h-[50px] px-0.5 border-b border-line-soft last:border-b-0 text-sm font-bold text-ink hover:text-ink"
                                >
                                    <span>{item.label}</span>
                                    <span className="text-[15px] text-[color:var(--muted-4)]">›</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}

                {user && (
                    <div className="px-4 pt-2">
                        <button
                            onClick={() => {
                                setUser(null);
                                onClose();
                            }}
                            className="w-full h-12 rounded-xl border border-line bg-surface text-danger text-sm font-bold"
                        >
                            Гарах
                        </button>
                    </div>
                )}

                <div className="m-4 p-5 rounded-2xl bg-night">
                    <div className="text-[11.5px] font-bold tracking-[0.1em] text-white/50">DT Trading</div>
                    <a href={DT_CONTACT.primary.href} className="block mt-2.5 text-base font-extrabold text-white hover:text-white">
                        {DT_CONTACT.primary.display}
                    </a>
                    <a href={DT_CONTACT.secondary.href} className="block mt-0.5 text-[13.5px] font-bold text-white/60 hover:text-white/60">
                        {DT_CONTACT.secondary.display}
                    </a>
                    <p className="mt-3 text-xs leading-[1.6] text-white/60">Инчон хот, Ённсү дүүрэг, Нынхөдэ-ро 192</p>
                </div>
            </div>
        </div>
    );
}
