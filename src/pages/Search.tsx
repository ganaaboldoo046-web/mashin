import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import TopTicker from '../components/TopTicker';
import SearchSection from '../components/SearchSection';
import BottomNav from '../components/BottomNav';
import CarCard from '../components/CarCard';
import Footer from '../components/Footer';
import DataStatePanel from '../components/DataStatePanel';
import { getProductsOrThrow, getSavedIds } from '../utils/storage';
import type { Product } from '../utils/storage';
import { fuelLabel } from '../utils/format';
import {
    FILTER_GROUPS,
    filterOptionLabel,
    matchesFilter,
    productMileage,
    productPriceMnt,
    type FilterGroupKey,
} from '../utils/productFilters';

type Selection = Record<FilterGroupKey, string[]>;

const EMPTY: Selection = { years: [], miles: [], prices: [], fuels: [] };

type SortKey = 'recommended' | 'newest' | 'priceAsc' | 'priceDesc' | 'kmAsc';
type ViewKey = 'grid' | 'list' | 'compact';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: 'recommended', label: 'Санал болгох' },
    { key: 'newest', label: 'Шинэ зар эхэлж' },
    { key: 'priceAsc', label: 'Үнэ багаас их рүү' },
    { key: 'priceDesc', label: 'Үнэ ихээс бага руу' },
    { key: 'kmAsc', label: 'Гүйлт багатай нь' },
];

const VIEW_MODES: { key: ViewKey; icon: string; label: string }[] = [
    { key: 'grid', icon: '▦', label: 'Жижиг хүснэгтээр харах' },
    { key: 'list', icon: '☰', label: 'Том картаар харах' },
    { key: 'compact', icon: '▤', label: 'Жагсаалтаар харах' },
];

const brandOf = (product: Product) => product.name.trim().split(/\s+/)[0].toLocaleUpperCase('en-US');

const chipClass = (active: boolean) =>
    `flex-none h-10 px-[15px] rounded-[20px] border text-[13px] whitespace-nowrap transition-colors lg:h-9 lg:rounded-[9px] ${
        active
            ? 'border-primary bg-primary-soft text-primary font-bold'
            : 'border-line-strong bg-surface text-ink-soft font-semibold'
    }`;

const pillClass = (active: boolean) =>
    `h-10 px-[15px] rounded-[10px] border text-[13px] whitespace-nowrap transition-colors ${
        active ? 'border-primary bg-primary-soft text-primary font-bold' : 'border-line bg-surface-2 text-muted-strong font-semibold'
    }`;

export default function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const [products, setProducts] = useState<Product[]>([]);
    const [savedIds, setSavedIds] = useState<number[]>(getSavedIds);
    const [selection, setSelection] = useState<Selection>(EMPTY);
    const [brands, setBrands] = useState<string[]>([]);
    const [panelOpen, setPanelOpen] = useState(false);
    const [sort, setSort] = useState<SortKey>('recommended');
    const [sortOpen, setSortOpen] = useState(false);
    const [view, setView] = useState<ViewKey>('list');
    const [loadStatus, setLoadStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const [retryVersion, setRetryVersion] = useState(0);

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            setLoadStatus('loading');
            try {
                const data = await getProductsOrThrow();
                if (!cancelled) {
                    setProducts(data);
                    setLoadStatus('ready');
                }
            } catch {
                if (!cancelled) setLoadStatus('error');
            }
        };
        const loadSaved = () => setSavedIds(getSavedIds());
        load();
        window.addEventListener('storageProducts', load);
        window.addEventListener('storageSaved', loadSaved);
        return () => {
            cancelled = true;
            window.removeEventListener('storageProducts', load);
            window.removeEventListener('storageSaved', loadSaved);
        };
    }, [retryVersion]);

    useEffect(() => {
        document.body.style.overflow = panelOpen || sortOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [panelOpen, sortOpen]);

    const toggle = (key: FilterGroupKey, value: string) =>
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
        const matched = products.filter((product) => {
            if (q && !`${product.name} ${product.year} ${product.mileage} ${fuelLabel(product.fuel)}`.toLowerCase().includes(q))
                return false;
            if (brands.length > 0 && !brands.includes(brandOf(product))) return false;
            return FILTER_GROUPS.every(({ key }) => {
                const picked = selection[key];
                return picked.length === 0 || picked.some((value) => matchesFilter(key, value, product));
            });
        });

        const sorted = [...matched];
        switch (sort) {
            case 'newest':
                sorted.sort((a, b) => (b.id || 0) - (a.id || 0));
                break;
            case 'priceAsc':
                sorted.sort((a, b) => productPriceMnt(a) - productPriceMnt(b));
                break;
            case 'priceDesc':
                sorted.sort((a, b) => productPriceMnt(b) - productPriceMnt(a));
                break;
            case 'kmAsc':
                sorted.sort((a, b) => productMileage(a) - productMileage(b));
                break;
            default:
                sorted.sort((a, b) => Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)) || b.id - a.id);
                break;
        }
        return sorted;
    }, [products, query, selection, brands, sort]);

    const activeChips = [
        ...brands.map((b) => ({ label: b, remove: () => toggleBrand(b) })),
        ...FILTER_GROUPS.flatMap(({ key }) => selection[key].map((value) => ({ label: filterOptionLabel(key, value), remove: () => toggle(key, value) }))),
    ];

    const filterGroups = (
        <>
            <div className="py-[18px] border-b border-line-soft">
                <div className="text-[13.5px] font-extrabold mb-3">Брэнд</div>
                <div className="flex flex-wrap gap-2">
                    {brandRows.map(([brand, count]) => (
                        <button key={brand} onClick={() => toggleBrand(brand)} aria-pressed={brands.includes(brand)} className={pillClass(brands.includes(brand))}>
                            {brand} · {count}
                        </button>
                    ))}
                </div>
            </div>
            {FILTER_GROUPS.map((group) => (
                <div key={group.key} className="py-[18px] border-t border-line-soft first:border-t-0">
                    <div className="text-[13.5px] font-extrabold mb-3">{group.title}</div>
                    <div className="flex flex-wrap gap-2">
                        {group.options.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => toggle(group.key, option.id)}
                                aria-pressed={selection[group.key].includes(option.id)}
                                className={pillClass(selection[group.key].includes(option.id))}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </>
    );

    const chipRow = (
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 lg:flex-wrap lg:overflow-visible lg:px-0">
            <button onClick={() => setPanelOpen((v) => !v)} className={chipClass(activeChips.length > 0)}>
                Бүх шүүлтүүр ⇅
            </button>
            {FILTER_GROUPS.map((group) => (
                <button
                    key={group.key}
                    onClick={() => setPanelOpen(true)}
                    className={chipClass(selection[group.key].length > 0)}
                >
                    {group.shortTitle}
                    {selection[group.key].length > 0 ? ` ${selection[group.key].length}` : ''}
                    <span className="ml-1.5 text-[11px] text-muted-soft">⌄</span>
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
                                    className="flex items-center gap-2.5 px-1 py-[11px] border-b border-line text-left"
                                >
                                    <span
                                        className={`w-[22px] h-[22px] flex-none rounded-full flex items-center justify-center text-[11px] font-extrabold text-white ${
                                            active ? 'bg-primary' : 'bg-line'
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

                    <div className="flex items-center justify-between gap-2.5 px-4 pt-3 pb-3.5 lg:px-0 lg:pt-0">
                        <div className="flex-none text-[13.5px] font-bold lg:text-sm">
                            {query ? `"${query}" — ` : ''}
                            {results.length} машин
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setSortOpen(true)}
                                className="flex items-center gap-2.5 h-[42px] px-3.5 rounded-xl border border-line bg-surface text-[13px] font-bold text-ink whitespace-nowrap"
                            >
                                {SORT_OPTIONS.find((o) => o.key === sort)?.label}
                                <span className="text-[11px] text-muted-soft">⌄</span>
                            </button>
                            <div className="flex gap-0.5 p-1 rounded-xl border border-line bg-surface flex-none">
                                {VIEW_MODES.map((mode) => (
                                    <button
                                        key={mode.key}
                                        onClick={() => setView(mode.key)}
                                        aria-label={mode.label}
                                        aria-pressed={view === mode.key}
                                        className={`w-10 h-[34px] rounded-[9px] text-sm ${
                                            view === mode.key ? 'bg-night text-white' : 'text-placeholder'
                                        }`}
                                    >
                                        {mode.icon}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {loadStatus === 'loading' ? (
                        <DataStatePanel status="loading" className="mx-4 lg:mx-0" />
                    ) : loadStatus === 'error' ? (
                        <DataStatePanel status="error" onRetry={() => setRetryVersion((version) => version + 1)} className="mx-4 lg:mx-0" />
                    ) : results.length === 0 ? (
                        <div className="mx-4 bg-surface border border-line rounded-2xl px-5 py-12 text-center lg:mx-0 lg:py-14">
                            <div className="text-[15px] font-extrabold">Тохирох зар олдсонгүй</div>
                            <div className="mt-1.5 text-[13px] text-muted">Шүүлтүүрээ багасгаад дахин оролдоно уу.</div>
                            <button onClick={reset} className="mt-4 h-11 px-5 rounded-[11px] bg-primary text-white text-[13.5px] font-bold">
                                Цэвэрлэх
                            </button>
                        </div>
                    ) : (
                        <div
                            className={
                                view === 'grid'
                                    ? 'grid grid-cols-2 gap-x-3 gap-y-4 px-4 lg:grid-cols-4 lg:gap-4 lg:px-0'
                                    : 'flex flex-col gap-3 px-4 lg:px-0' +
                                      (view === 'list' ? ' lg:grid lg:grid-cols-2 lg:gap-4' : '')
                            }
                        >
                            {results.map((product, i) => (
                                <CarCard
                                    key={product.id}
                                    product={product}
                                    variant={view === 'grid' ? 'compact' : view === 'compact' ? 'row' : 'grid'}
                                    savedIds={savedIds}
                                    priority={i === 0}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* 정렬 바텀시트 */}
            {sortOpen && (
                <div
                    className="fixed inset-0 z-[55] bg-[var(--overlay)] flex items-end justify-center lg:items-center lg:p-6"
                    onClick={() => setSortOpen(false)}
                >
                    <div
                        className="w-full max-w-app bg-surface rounded-t-[20px] animate-sheet-up lg:max-w-[420px] lg:rounded-[20px] lg:shadow-modal lg:animate-slide-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-5 pt-[18px] pb-3 flex items-center justify-between border-b border-line-soft">
                            <div className="text-[17px] font-extrabold tracking-[-0.02em]">Эрэмбэлэх</div>
                            <button onClick={() => setSortOpen(false)} aria-label="Хаах" className="w-9 h-9 rounded-[10px] bg-line text-muted text-[15px]">
                                ✕
                            </button>
                        </div>
                        <div className="px-5 pt-1 pb-6 flex flex-col">
                            {SORT_OPTIONS.map((option) => {
                                const active = option.key === sort;
                                return (
                                    <button
                                        key={option.key}
                                        onClick={() => {
                                            setSort(option.key);
                                            setSortOpen(false);
                                        }}
                                        className={`w-full min-h-[50px] px-1 flex items-center justify-between border-b border-line-soft last:border-b-0 text-[14.5px] ${
                                            active ? 'font-extrabold text-primary' : 'font-semibold text-ink'
                                        }`}
                                    >
                                        {option.label}
                                        <span>{active ? '✓' : ''}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

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
                            <button onClick={() => setPanelOpen(false)} aria-label="Хаах" className="w-9 h-9 rounded-[10px] bg-surface-4 text-muted text-[15px]">
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
