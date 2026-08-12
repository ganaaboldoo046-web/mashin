import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import TopTicker from '../components/TopTicker';
import SearchSection from '../components/SearchSection';
import BottomNav from '../components/BottomNav';
import CarCard from '../components/CarCard';
import Footer from '../components/Footer';
import { getProducts, getSavedIds } from '../utils/storage';
import type { Product } from '../utils/storage';
import { fuelLabel } from '../utils/format';

type GroupKey = 'years' | 'miles' | 'prices' | 'fuels';
type Selection = Record<GroupKey, string[]>;

const EMPTY: Selection = { years: [], miles: [], prices: [], fuels: [] };

const GROUPS: { key: GroupKey; title: string; values: string[] }[] = [
    { key: 'years', title: 'Үйлдвэрлэсэн он', values: ['2020+', '2015–2019', '2014 ба хуучин'] },
    { key: 'miles', title: 'Гүйлт', values: ['50 мянга хүртэл', '50–100 мянга', '100 мянгаас дээш'] },
    { key: 'prices', title: 'Үнэ', values: ['30 сая хүртэл', '30–60 сая', '60 саяас дээш'] },
    { key: 'fuels', title: 'Түлш', values: ['Бензин', 'Дизель', 'Хайбрид', 'Цахилгаан', 'Газ'] },
];

/** "33.6 сая ₮" 처럼 사람이 읽는 가격 문자열을 ₮ 정수로 되돌린다. */
const priceValue = (price: string) => {
    const n = parseFloat(price.replace(/[^0-9.]/g, ''));
    if (Number.isNaN(n)) return 0;
    return price.includes('сая') ? n * 1_000_000 : n;
};

const mileageValue = (mileage: string) => Number(mileage.replace(/[^0-9]/g, '')) || 0;
const yearValue = (year: string) => Number(String(year).slice(0, 4)) || 0;
const brandOf = (product: Product) => product.name.trim().split(' ')[0];

function matchesGroup(key: GroupKey, value: string, product: Product) {
    switch (key) {
        case 'years': {
            const y = yearValue(product.year);
            if (value === '2020+') return y >= 2020;
            if (value === '2015–2019') return y >= 2015 && y <= 2019;
            return y > 0 && y <= 2014;
        }
        case 'miles': {
            const km = mileageValue(product.mileage);
            if (value === '50 мянга хүртэл') return km <= 50_000;
            if (value === '50–100 мянга') return km > 50_000 && km <= 100_000;
            return km > 100_000;
        }
        case 'prices': {
            const p = priceValue(product.price);
            if (value === '30 сая хүртэл') return p <= 30_000_000;
            if (value === '30–60 сая') return p > 30_000_000 && p <= 60_000_000;
            return p > 60_000_000;
        }
        case 'fuels':
            return fuelLabel(product.fuel) === value;
    }
}

const chipClass = (active: boolean) =>
    `flex-none h-10 px-[15px] rounded-[20px] border text-[13px] whitespace-nowrap transition-colors lg:h-9 lg:rounded-[9px] ${
        active
            ? 'border-primary bg-primary-soft text-primary font-bold'
            : 'border-line-strong bg-surface text-ink-soft font-semibold'
    }`;

const pillClass = (active: boolean) =>
    `h-10 px-[15px] rounded-[10px] border text-[13px] whitespace-nowrap transition-colors ${
        active ? 'border-primary bg-primary-soft text-primary font-bold' : 'border-[#e2e5ea] bg-surface-2 text-[#4b5563] font-semibold'
    }`;

export default function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const [products, setProducts] = useState<Product[]>([]);
    const [savedIds, setSavedIds] = useState<number[]>(getSavedIds);
    const [selection, setSelection] = useState<Selection>(EMPTY);
    const [brands, setBrands] = useState<string[]>([]);
    const [panelOpen, setPanelOpen] = useState(false);

    useEffect(() => {
        const load = async () => setProducts(await getProducts());
        const loadSaved = () => setSavedIds(getSavedIds());
        load();
        window.addEventListener('storageProducts', load);
        window.addEventListener('storageSaved', loadSaved);
        return () => {
            window.removeEventListener('storageProducts', load);
            window.removeEventListener('storageSaved', loadSaved);
        };
    }, []);

    useEffect(() => {
        document.body.style.overflow = panelOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [panelOpen]);

    const toggle = (key: GroupKey, value: string) =>
        setSelection((prev) => ({
            ...prev,
            [key]: prev[key].includes(value) ? prev[key].filter((v) => v !== value) : [...prev[key], value],
        }));

    const toggleBrand = (brand: string) =>
        setBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]));

    const reset = () => {
        setSelection(EMPTY);
        setBrands([]);
    };

    const brandRows = useMemo(() => {
        const counts = new Map<string, number>();
        products.forEach((p) => counts.set(brandOf(p), (counts.get(brandOf(p)) || 0) + 1));
        return [...counts.entries()].sort((a, b) => b[1] - a[1]);
    }, [products]);

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        return products.filter((product) => {
            if (q && !`${product.name} ${product.year} ${product.mileage} ${fuelLabel(product.fuel)}`.toLowerCase().includes(q))
                return false;
            if (brands.length > 0 && !brands.includes(brandOf(product))) return false;
            return GROUPS.every(({ key }) => {
                const picked = selection[key];
                return picked.length === 0 || picked.some((value) => matchesGroup(key, value, product));
            });
        });
    }, [products, query, selection, brands]);

    const activeChips = [
        ...brands.map((b) => ({ label: b, remove: () => toggleBrand(b) })),
        ...GROUPS.flatMap(({ key }) => selection[key].map((value) => ({ label: value, remove: () => toggle(key, value) }))),
    ];

    const filterGroups = (
        <>
            {GROUPS.map((group) => (
                <div key={group.key} className="py-[18px] border-t border-line-soft first:border-t-0">
                    <div className="text-[13.5px] font-extrabold mb-3">{group.title}</div>
                    <div className="flex flex-wrap gap-2">
                        {group.values.map((value) => (
                            <button
                                key={value}
                                onClick={() => toggle(group.key, value)}
                                className={pillClass(selection[group.key].includes(value))}
                            >
                                {value}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </>
    );

    const chipRow = (
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 lg:flex-wrap lg:overflow-visible lg:px-0">
            <button
                onClick={() => setPanelOpen((v) => !v)}
                className={`flex-none h-10 px-[15px] rounded-[20px] border border-ink text-[13px] font-bold whitespace-nowrap lg:h-9 lg:rounded-[9px] ${
                    panelOpen ? 'bg-surface text-ink' : 'bg-ink text-white'
                }`}
            >
                Бүх шүүлтүүр ⇅
            </button>
            {GROUPS.map((group) => (
                <button
                    key={group.key}
                    onClick={() => setPanelOpen(true)}
                    className={chipClass(selection[group.key].length > 0)}
                >
                    {group.title.split(' ')[0]}
                    {selection[group.key].length > 0 ? ` ${selection[group.key].length}` : ''}
                </button>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-canvas pb-24 lg:pb-0">
            <Header />
            <TopTicker />
            <SearchSection />

            <main className="lg:max-w-shell lg:mx-auto lg:px-6 lg:pt-6 lg:pb-20 lg:grid lg:grid-cols-[236px_1fr] lg:gap-7 lg:items-start">
                {/* 데스크탑 사이드바: 브랜드 필터 */}
                <aside className="hidden lg:block lg:sticky lg:top-[92px]">
                    <div className="rounded-2xl bg-night p-5 mb-5">
                        <div className="text-base font-extrabold text-white leading-[1.4]">
                            Бүх машин
                            <br />1 жилийн баталгаа
                        </div>
                        <div className="mt-8 text-[11.5px] font-bold tracking-[0.1em] text-night-line">DT CARE</div>
                    </div>
                    <div className="text-[15px] font-extrabold mb-1.5">Брэнд · Загвар</div>
                    <div className="flex flex-col">
                        {brandRows.map(([brand, count]) => {
                            const active = brands.includes(brand);
                            return (
                                <button
                                    key={brand}
                                    onClick={() => toggleBrand(brand)}
                                    className="flex items-center gap-2.5 px-1 py-[11px] border-b border-[#ebedf1] text-left"
                                >
                                    <span
                                        className={`w-[22px] h-[22px] flex-none rounded-full flex items-center justify-center text-[11px] font-extrabold text-white ${
                                            active ? 'bg-primary' : 'bg-[#eef0f4]'
                                        }`}
                                    >
                                        {active ? '✓' : ''}
                                    </span>
                                    <span className={`flex-1 text-[13.5px] font-bold ${active ? 'text-primary' : 'text-ink'}`}>{brand}</span>
                                    <span className={`text-[12.5px] font-semibold ${active ? 'text-primary' : 'text-muted-soft'}`}>{count}</span>
                                </button>
                            );
                        })}
                    </div>
                </aside>

                <section>
                    <div className="sticky top-[61px] z-20 bg-canvas pt-3 pb-2.5 lg:static lg:pt-0 lg:pb-0 lg:mb-3.5">{chipRow}</div>

                    {/* 데스크탑 인라인 필터 패널 */}
                    {panelOpen && (
                        <div className="hidden lg:block bg-surface border border-line rounded-2xl px-6 pt-2 pb-5 mb-4">
                            {filterGroups}
                            <div className="flex gap-2 pt-[18px] border-t border-line-soft mt-3.5">
                                <button onClick={reset} className="h-[42px] px-[18px] rounded-[10px] border border-line-strong bg-surface text-[13.5px] font-bold text-ink-soft">
                                    Цэвэрлэх
                                </button>
                                <button onClick={() => setPanelOpen(false)} className="flex-1 h-[42px] rounded-[10px] bg-primary text-white text-[13.5px] font-bold">
                                    {results.length} зар харах
                                </button>
                            </div>
                        </div>
                    )}

                    {activeChips.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 px-4 mb-4 lg:px-0">
                            {activeChips.map((chip) => (
                                <button
                                    key={chip.label}
                                    onClick={chip.remove}
                                    className="h-8 pl-3 pr-2.5 inline-flex items-center gap-1.5 rounded-lg border border-primary bg-primary-soft text-primary text-[12.5px] font-bold whitespace-nowrap"
                                >
                                    {chip.label} <span className="text-[13px]">✕</span>
                                </button>
                            ))}
                            <button onClick={reset} className="text-[12.5px] font-bold text-muted">
                                Бүгдийг цэвэрлэх
                            </button>
                        </div>
                    )}

                    <div className="flex items-center justify-between px-4 pt-3 pb-3.5 lg:px-0 lg:pt-0">
                        <div className="text-[13.5px] font-bold lg:text-sm">
                            {query ? `"${query}" — ` : ''}
                            {results.length} машин
                        </div>
                    </div>

                    {results.length === 0 ? (
                        <div className="mx-4 bg-surface border border-line rounded-2xl px-5 py-12 text-center lg:mx-0 lg:py-14">
                            <div className="text-[15px] font-extrabold">Тохирох зар олдсонгүй</div>
                            <div className="mt-1.5 text-[13px] text-muted">Шүүлтүүрээ багасгаад дахин оролдоно уу.</div>
                            <button onClick={reset} className="mt-4 h-11 px-5 rounded-[11px] bg-primary text-white text-[13.5px] font-bold">
                                Цэвэрлэх
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 px-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:px-0">
                            {results.map((product, i) => (
                                <CarCard key={product.id} product={product} savedIds={savedIds} priority={i === 0} />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* 모바일 필터 바텀시트 */}
            {panelOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-50 bg-[rgba(9,14,24,0.5)] flex items-end justify-center"
                    onClick={() => setPanelOpen(false)}
                >
                    <div
                        className="w-full max-w-app bg-surface rounded-t-[20px] max-h-[80vh] overflow-y-auto animate-sheet-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-surface px-5 pt-[18px] pb-3 flex items-center justify-between border-b border-line-soft">
                            <div className="text-[17px] font-extrabold tracking-[-0.02em]">Шүүлтүүр</div>
                            <button onClick={() => setPanelOpen(false)} className="w-9 h-9 rounded-[10px] bg-surface-4 text-muted text-[15px]">
                                ✕
                            </button>
                        </div>
                        <div className="px-5 pb-5">{filterGroups}</div>
                        <div className="sticky bottom-0 bg-surface border-t border-line-soft px-5 pt-3 pb-5 flex gap-2.5">
                            <button onClick={reset} className="h-[50px] px-5 rounded-xl border border-line-strong bg-surface text-sm font-bold text-ink-soft">
                                Цэвэрлэх
                            </button>
                            <button onClick={() => setPanelOpen(false)} className="flex-1 h-[50px] rounded-xl bg-primary text-white text-[14.5px] font-bold">
                                {results.length} зар харах
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="hidden lg:block">
                <Footer />
            </div>
            <BottomNav />
        </div>
    );
}
