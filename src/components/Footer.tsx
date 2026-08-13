import { Link } from 'react-router-dom';

const COLUMNS = [
    {
        title: 'ҮЙЛЧИЛГЭЭ',
        links: [
            { label: 'Машин худалдан авах', to: '/search' },
            { label: 'Хадгалсан зар', to: '/saved' },
        ],
    },
    {
        title: 'КОМПАНИ',
        links: [{ label: 'Бидний тухай', to: '/about' }],
    },
    {
        title: 'ЭРХ ЗҮЙ',
        links: [
            { label: 'Үйлчилгээний нөхцөл', to: '/terms' },
            { label: 'Нууцлалын бодлого', to: '/privacy' },
        ],
    },
];

const ADDRESS = '192, Neungheodae-ro, Yeonsu-gu, Incheon, Republic of Korea';

export default function Footer() {
    return (
        <footer className="bg-surface border-t border-line mt-10 lg:mt-0">
            {/* 모바일: 다크 연락처 카드 + 법적 고지 */}
            <div className="lg:hidden px-4 py-8">
                <div className="bg-night rounded-2xl p-5">
                    <div className="text-[11.5px] font-bold tracking-[0.1em] text-night-line">DT-TRADING</div>
                    <a href="tel:01057279927" className="block mt-2.5 text-base font-extrabold text-white hover:text-white">
                        010 5727 9927
                    </a>
                    <a href="tel:99001979" className="block mt-0.5 text-[13.5px] font-bold text-night-text hover:text-night-text">
                        9900 1979
                    </a>
                    <p className="mt-3 text-xs leading-[1.6] text-night-text">Инчон хот, Ённсү дүүрэг, Нынхөдэ-ро 192</p>
                </div>
                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                    {COLUMNS.flatMap((col) => col.links).map((link) => (
                        <Link key={link.to} to={link.to} className="text-xs font-semibold text-muted">
                            {link.label}
                        </Link>
                    ))}
                </div>
                <p className="mt-5 text-[11px] text-muted-faint">© 2026 dt-trading. All rights reserved.</p>
            </div>

            {/* 데스크탑: 4열 푸터 */}
            <div className="hidden lg:block px-6 pt-12 pb-14">
                <div className="max-w-shell mx-auto grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-8">
                    <div>
                        <img src="/logo.png" alt="dt-trading" className="brand-logo h-[34px] w-auto block" />
                        <div className="mt-3.5 text-[12.5px] leading-[1.7] text-muted">
                            {ADDRESS}
                            <br />
                            <a href="tel:01057279927">010 5727 9927</a> · <a href="tel:99001979">9900 1979</a>
                        </div>
                        <a
                            href="https://www.facebook.com/temmun.trading"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-2 text-[12.5px] font-bold text-muted hover:text-primary"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Facebook
                        </a>
                    </div>
                    {COLUMNS.map((col) => (
                        <div key={col.title}>
                            <div className="text-xs font-extrabold tracking-[0.08em] text-ink mb-3.5">{col.title}</div>
                            <div className="flex flex-col gap-2.5">
                                {col.links.map((link) => (
                                    <Link key={link.to} to={link.to} className="text-[13px] font-medium text-muted hover:text-primary">
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="max-w-shell mx-auto mt-10 pt-[22px] border-t border-line-soft text-xs text-muted-faint">
                    © 2026 dt-trading. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
