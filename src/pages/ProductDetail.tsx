import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import TopTicker from '../components/TopTicker';
import Image from '../components/Image';
import CarCard from '../components/CarCard';
import Footer from '../components/Footer';
import { getProducts, addToRecentlyViewed, isSaved, toggleSaved } from '../utils/storage';
import type { Product } from '../utils/storage';
import { carMeta, formatKRW, fuelLabel, STATUS_LABELS } from '../utils/format';
import { useUser } from '../hooks/useUser';
import { VEHICLE_OPTIONS } from '../constants/vehicleOptions';

const OPTION_GROUPS: { key: string; title: string }[] = [
    { key: 'exterior', title: 'Гадаад / Дотоод' },
    { key: 'safety', title: 'Аюулгүй байдал' },
    { key: 'convenience', title: 'Тав тух / Мультимедиа' },
    { key: 'seat', title: 'Суудал' },
];

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const user = useUser();

    const [product, setProduct] = useState<Product | null>(null);
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const [activeImage, setActiveImage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isProductSaved, setIsProductSaved] = useState(false);

    const [isCallModalOpen, setIsCallModalOpen] = useState(false);
    const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
    const [reservationForm, setReservationForm] = useState({ userName: '', phone: '', facebookId: '' });
    const [reservationStatus, setReservationStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    useEffect(() => {
        window.scrollTo(0, 0);

        const loadData = async () => {
            if (id) {
                const products = await getProducts();
                const found = products.find((p) => p.id === Number(id));
                setProduct(found || null);

                if (found) {
                    setIsProductSaved(isSaved(found.id));
                    addToRecentlyViewed(found.id);
                    setSimilarProducts(
                        products.filter((p) => p.categoryId === found.categoryId && p.id !== found.id).slice(0, 4)
                    );
                }
            }
            setLoading(false);
        };

        loadData();
    }, [id]);

    useEffect(() => {
        const open = isCallModalOpen || isReservationModalOpen;
        document.body.style.overflow = open ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isCallModalOpen, isReservationModalOpen]);

    const optionGroups = useMemo(() => {
        const owned = new Set(product?.options || []);
        return OPTION_GROUPS.map((group) => {
            const items = VEHICLE_OPTIONS.filter((o) => o.category === group.key).map((o) => ({
                label: o.label,
                on: owned.has(o.id),
            }));
            return { ...group, items, on: items.filter((i) => i.on).length };
        }).filter((group) => group.items.length > 0);
    }, [product]);

    const optionSummary = useMemo(() => {
        const total = optionGroups.reduce((sum, g) => sum + g.items.length, 0);
        const have = optionGroups.reduce((sum, g) => sum + g.on, 0);
        return total > 0 ? `${have} / ${total} тоноглол` : '';
    }, [optionGroups]);

    const handleShare = async () => {
        const shareData = {
            title: product?.name || 'DT-TRADING',
            text: `Check out this car: ${product?.name}`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert('Линк хуулагдлаа!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    const handleToggleSave = () => {
        if (product) setIsProductSaved(toggleSaved(product.id));
    };

    const openBooking = () => {
        setReservationForm((form) => ({ ...form, userName: form.userName || user?.name || '' }));
        setReservationStatus('idle');
        setIsReservationModalOpen(true);
    };

    const handleReservationSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setReservationStatus('submitting');

        try {
            const response = await fetch('/api/reservations_create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: product?.id,
                    productName: product?.name,
                    userId: user?.email,
                    ...reservationForm,
                }),
            });

            if (response.ok) {
                try {
                    // NOTE: Replace these with your actual EmailJS keys
                    const SERVICE_ID = 'YOUR_SERVICE_ID';
                    const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
                    const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

                    await emailjs.send(
                        SERVICE_ID,
                        TEMPLATE_ID,
                        {
                            product_name: product?.name,
                            product_price: product?.price,
                            user_name: reservationForm.userName,
                            user_phone: reservationForm.phone,
                            user_facebook: reservationForm.facebookId,
                            user_email: user?.email || 'Guest',
                            date: new Date().toLocaleString(),
                        },
                        PUBLIC_KEY
                    );
                } catch (emailError) {
                    console.error('Failed to send email:', emailError);
                }

                setReservationStatus('success');
            } else {
                setReservationStatus('error');
            }
        } catch (error) {
            setReservationStatus('error');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-canvas">
                <div className="w-8 h-8 rounded-full border-4 border-line border-t-primary animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-canvas px-6 text-center">
                <p className="text-[15px] font-extrabold">Бүтээгдэхүүн олдсонгүй</p>
                <button onClick={() => navigate('/')} className="h-11 px-5 rounded-[11px] bg-primary text-white text-[13.5px] font-bold">
                    Нүүр хуудас
                </button>
            </div>
        );
    }

    const images = product.images?.length ? product.images : [];
    const krw = formatKRW(product.priceKRW);
    const meta = carMeta(product);

    const specs = [
        { k: 'Үйлдвэрлэсэн он', v: product.year },
        { k: 'Гүйлт', v: product.mileage },
        { k: 'Түлш', v: fuelLabel(product.fuel) },
        { k: 'Хөдөлгүүр', v: product.engine },
        { k: 'Хурдны хайрцаг', v: product.transmission },
        { k: 'Хөтлөгч', v: product.drive },
        { k: 'Өнгө', v: product.color },
        { k: 'Дотор өнгө', v: product.interiorColor },
        { k: 'Хаалга', v: product.doors },
        { k: 'Байдал', v: STATUS_LABELS[product.status] },
    ].filter((s): s is { k: string; v: string } => !!s.v && s.v !== '-');

    /* 가격 · CTA 블록 — 모바일은 본문 상단, 데스크탑은 우측 사이드바에서 재사용 */
    const priceBlock = (
        <>
            <div className="flex gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-primary bg-primary-soft rounded-[5px] px-2 py-[5px] whitespace-nowrap">
                    {STATUS_LABELS[product.status]}
                </span>
                {product.isFeatured && (
                    <span className="text-[11px] font-bold text-muted-strong bg-surface-4 rounded-[5px] px-2 py-[5px] whitespace-nowrap">
                        Онцлох
                    </span>
                )}
            </div>
            <h1 className="mt-3 mb-0 text-[21px] font-extrabold tracking-[-0.025em] leading-[1.3] lg:text-2xl">{product.name}</h1>
            <div className="mt-1.5 text-[13px] font-medium text-muted lg:mt-2 lg:text-[13.5px]">{meta}</div>

            <div className="mt-[18px] lg:mt-[22px] lg:pt-5 lg:border-t lg:border-[#eef0f3]">
                <div className="text-[12.5px] font-bold text-muted-soft">Машины үнэ</div>
                <div className="mt-1 text-[28px] font-extrabold text-primary tracking-[-0.03em] lg:mt-1.5 lg:text-[32px]">{product.price}</div>
                {krw && (
                    <div className="mt-1 text-[12.5px] font-medium text-muted-faint lg:text-[13px]">Солонгост {krw}</div>
                )}
                <div className="mt-3.5 bg-surface-3 border border-line rounded-xl p-3.5 lg:mt-4 lg:px-4">
                    <div className="text-[12.5px] font-bold text-muted-strong lg:text-[13px]">Багцад багтсан</div>
                    <div className="mt-1 text-[15px] font-extrabold tracking-[-0.02em] lg:text-[17px]">Тээвэр · Гааль · Бүртгэл</div>
                    <div className="mt-1.5 text-[11.5px] font-medium text-muted-soft leading-[1.5] lg:mt-2 lg:text-xs">
                        Ханшийн өөрчлөлтөөс шалтгаалж үнэ бага зэрэг хэлбэлзэж болно.
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-canvas pb-[116px] lg:pb-0">
            <Header showBack title={product.name} />
            <TopTicker />

            <main className="lg:max-w-shell lg:mx-auto lg:px-6 lg:pt-5 lg:pb-20">
                <div className="hidden lg:block text-[12.5px] font-semibold text-muted-faint mb-4">
                    <Link to="/search" className="text-muted-faint hover:text-primary">
                        Автомашин
                    </Link>{' '}
                    · {product.name}
                </div>

                <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-7 lg:items-start">
                    <div>
                        {/* 갤러리 */}
                        <div className="relative aspect-[4/3] bg-photo-strong flex items-center justify-center overflow-hidden lg:aspect-[16/10] lg:rounded-[18px] lg:border lg:border-line">
                            {images.length > 0 ? (
                                <>
                                    <div
                                        id="image-gallery-container"
                                        className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
                                        onScroll={(e) => {
                                            const el = e.currentTarget;
                                            setActiveImage(Math.round(el.scrollLeft / el.clientWidth));
                                        }}
                                    >
                                        {images.map((img, idx) => (
                                            <div key={idx} className="w-full h-full flex-shrink-0 snap-center flex items-center justify-center">
                                                <Image
                                                    src={img}
                                                    alt={`${product.name} - ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                    size="full"
                                                    priority={idx === 0}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    {images.length > 1 && (
                                        <div className="absolute bottom-3 right-3.5 text-[11.5px] font-bold text-white bg-night/60 rounded-full px-2.5 py-[5px]">
                                            {activeImage + 1} / {images.length}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <span className="text-[11.5px] font-bold tracking-[0.12em] text-placeholder">ГОЛ ЗУРАГ</span>
                            )}
                        </div>

                        {/* 데스크탑 썸네일 */}
                        {images.length > 1 && (
                            <div className="hidden lg:grid grid-cols-5 gap-2.5 mt-2.5">
                                {images.slice(0, 5).map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            const container = document.getElementById('image-gallery-container');
                                            if (container) container.scrollTo({ left: container.clientWidth * idx, behavior: 'smooth' });
                                        }}
                                        className={`aspect-[4/3] rounded-[10px] overflow-hidden border ${
                                            idx === activeImage ? 'border-primary' : 'border-line'
                                        }`}
                                    >
                                        <Image src={img} alt="" className="w-full h-full object-cover" size="thumbnail" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* 모바일 가격 블록 */}
                        <div className="lg:hidden bg-surface px-4 pt-5 pb-[22px] border-b border-[#e9ebef]">{priceBlock}</div>

                        {/* 주요 사양 */}
                        <h2 className="hidden lg:block m-0 mt-9 mb-3.5 text-[19px] font-extrabold tracking-[-0.02em]">Үндсэн үзүүлэлт</h2>
                        <div className="bg-surface mt-3 px-4 py-5 lg:mt-0 lg:rounded-2xl lg:border lg:border-line lg:px-6 lg:py-2">
                            <div className="lg:hidden text-base font-extrabold tracking-[-0.02em] mb-3.5">Үндсэн үзүүлэлт</div>
                            <div className="grid grid-cols-2 gap-3 lg:block lg:gap-0">
                                {specs.map((spec) => (
                                    <div
                                        key={spec.k}
                                        className="bg-surface-2 rounded-[11px] px-3.5 py-3 lg:grid lg:grid-cols-[180px_1fr] lg:bg-transparent lg:rounded-none lg:px-0 lg:py-[15px] lg:border-b lg:border-line-soft lg:last:border-b-0"
                                    >
                                        <span className="block text-[11.5px] font-semibold text-muted-soft lg:text-[13.5px]">{spec.k}</span>
                                        <span className="block mt-1 text-[13.5px] font-bold lg:mt-0">{spec.v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 옵션 */}
                        {optionGroups.length > 0 && (
                            <>
                                <div className="hidden lg:flex items-baseline justify-between mt-9 mb-3.5">
                                    <h2 className="m-0 text-[19px] font-extrabold tracking-[-0.02em]">Нэмэлт тоноглол</h2>
                                    <span className="text-[13px] font-bold text-muted-faint">{optionSummary}</span>
                                </div>
                                <div className="bg-surface mt-3 px-4 py-5 lg:mt-0 lg:rounded-2xl lg:border lg:border-line lg:px-6 lg:pt-1 lg:pb-5">
                                    <div className="lg:hidden flex items-baseline justify-between mb-3.5">
                                        <div className="text-base font-extrabold tracking-[-0.02em]">Нэмэлт тоноглол</div>
                                        <span className="text-[12.5px] font-bold text-muted-faint">{optionSummary}</span>
                                    </div>
                                    {optionGroups.map((group) => (
                                        <div key={group.key} className="py-3.5 border-t border-line-soft first:border-t-0 lg:py-5">
                                            <div className="flex items-baseline gap-2 mb-2.5 lg:mb-3.5">
                                                <span className="text-[13.5px] font-extrabold lg:text-sm">{group.title}</span>
                                                <span className="text-[11.5px] font-bold text-primary lg:text-xs">
                                                    {group.on}/{group.items.length}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 lg:grid-cols-3 lg:gap-x-3.5 lg:gap-y-2">
                                                {group.items.map((item) => (
                                                    <div key={item.label} className="flex items-center gap-2 min-w-0 py-1 lg:py-[7px] lg:gap-2.5">
                                                        <span
                                                            className={`flex-none w-[17px] h-[17px] rounded-full flex items-center justify-center text-[9.5px] font-bold lg:w-[18px] lg:h-[18px] lg:text-[10px] ${
                                                                item.on ? 'bg-primary text-white' : 'bg-[#eef0f4] text-[#c3c9d2]'
                                                            }`}
                                                        >
                                                            ✓
                                                        </span>
                                                        <span
                                                            className={`text-[12.5px] truncate lg:text-[13.5px] ${
                                                                item.on ? 'font-semibold text-[#1f2937]' : 'font-medium text-[#b6bcc6]'
                                                            }`}
                                                        >
                                                            {item.label}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* 설명 */}
                        <h2 className="hidden lg:block m-0 mt-9 mb-3.5 text-[19px] font-extrabold tracking-[-0.02em]">Тайлбар</h2>
                        <div className="bg-surface mt-3 px-4 py-5 lg:mt-0 lg:rounded-2xl lg:border lg:border-line lg:px-6 lg:py-[22px]">
                            <div className="lg:hidden text-base font-extrabold tracking-[-0.02em] mb-3">Тайлбар</div>
                            <p className="m-0 text-[13.5px] leading-[1.75] text-ink-soft whitespace-pre-wrap lg:text-[14.5px]">
                                {product.description || 'Тайлбар байхгүй байна.'}
                            </p>
                        </div>

                        {/* 유사 매물 */}
                        {similarProducts.length > 0 && (
                            <>
                                <div className="flex items-baseline justify-between px-4 pt-6 pb-3 lg:px-0 lg:mt-9 lg:mb-3.5 lg:pt-0 lg:pb-0">
                                    <h2 className="m-0 text-base font-extrabold tracking-[-0.02em] lg:text-[19px]">Ижил төстэй зар</h2>
                                    <Link to="/search" className="text-[13px] font-bold text-primary lg:text-[13.5px]">
                                        Бүгдийг харах →
                                    </Link>
                                </div>
                                <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-1 lg:grid lg:grid-cols-4 lg:gap-3.5 lg:px-0 lg:overflow-visible">
                                    {similarProducts.map((item) => (
                                        <CarCard key={item.id} product={item} variant="mini" savable={false} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* 데스크탑 사이드바 */}
                    <aside className="hidden lg:flex lg:flex-col lg:gap-3.5 lg:sticky lg:top-[92px]">
                        <div className="bg-surface border border-line rounded-[18px] p-6">
                            {priceBlock}
                            <div className="flex flex-col gap-2.5 mt-[22px]">
                                <button onClick={openBooking} className="h-[50px] rounded-xl bg-primary text-white text-[15px] font-bold">
                                    Захиалга өгөх
                                </button>
                                <button
                                    onClick={handleToggleSave}
                                    className={`h-[50px] rounded-xl border border-line-strong bg-surface text-[15px] font-bold ${
                                        isProductSaved ? 'text-danger' : 'text-ink'
                                    }`}
                                >
                                    {isProductSaved ? '♥ Хадгалсан' : '♡ Хадгалах'}
                                </button>
                                <div className="grid grid-cols-2 gap-2.5">
                                    <button
                                        onClick={() => setIsCallModalOpen(true)}
                                        className="h-11 rounded-xl border border-line-strong bg-surface text-[13.5px] font-bold text-ink"
                                    >
                                        Залгах
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        className="h-11 rounded-xl border border-line-strong bg-surface text-[13.5px] font-bold text-ink"
                                    >
                                        Хуваалцах
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="bg-night rounded-[18px] px-6 py-[22px]">
                            <div className="text-xs font-bold tracking-[0.1em] text-night-line">DT-TRADING</div>
                            <a href="tel:01057279927" className="block mt-2.5 text-[17px] font-extrabold text-white hover:text-white">
                                010 5727 9927
                            </a>
                            <a href="tel:99001979" className="block mt-[3px] text-sm font-bold text-night-text hover:text-night-text">
                                9900 1979
                            </a>
                            <div className="mt-3.5 text-[12.5px] leading-[1.6] text-night-text">
                                Инчон хот, Ённсү дүүрэг,
                                <br />
                                Нынхөдэ-ро 192
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* 모바일 하단 고정 CTA */}
            <div className="lg:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app z-40 bg-white/95 backdrop-blur-sm border-t border-line px-4 pt-3 pb-4 flex gap-2.5 box-border">
                <button
                    onClick={handleToggleSave}
                    aria-label="Хадгалах"
                    className={`w-14 h-[52px] flex-none rounded-[13px] border border-line-strong bg-surface text-[19px] ${
                        isProductSaved ? 'text-danger' : 'text-[#94a0b2]'
                    }`}
                >
                    {isProductSaved ? '♥' : '♡'}
                </button>
                <button
                    onClick={() => setIsCallModalOpen(true)}
                    className="w-14 h-[52px] flex-none rounded-[13px] border border-line-strong bg-surface text-[17px] text-ink"
                    aria-label="Залгах"
                >
                    ☎︎
                </button>
                <button onClick={openBooking} className="flex-1 h-[52px] rounded-[13px] bg-primary text-white text-[15px] font-bold">
                    Захиалга өгөх
                </button>
            </div>

            <div className="hidden lg:block">
                <Footer />
            </div>

            {/* 전화 연결 모달 */}
            {isCallModalOpen && (
                <div
                    className="fixed inset-0 z-50 bg-[rgba(9,14,24,0.55)] flex items-end justify-center lg:items-center lg:p-6"
                    onClick={() => setIsCallModalOpen(false)}
                >
                    <div
                        className="w-full max-w-app bg-surface rounded-t-[20px] animate-sheet-up lg:max-w-[420px] lg:rounded-[20px] lg:shadow-modal lg:animate-slide-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-5 pt-[18px] pb-3 lg:px-6 lg:pt-[22px]">
                            <div className="text-[17px] font-extrabold tracking-[-0.02em]">Холбогдох дугаар</div>
                            <button onClick={() => setIsCallModalOpen(false)} className="w-9 h-9 rounded-[10px] bg-surface-4 text-muted text-[15px]">
                                ✕
                            </button>
                        </div>
                        <div className="px-5 pb-6 flex flex-col gap-2.5 lg:px-6">
                            <a href="tel:01057279927" className="bg-surface-3 border border-line rounded-xl px-4 py-3.5 hover:text-ink">
                                <div className="text-[12.5px] font-bold text-muted-soft">Солонгос дугаар</div>
                                <div className="mt-1 text-[17px] font-extrabold text-ink">010 5727 9927</div>
                            </a>
                            <a href="tel:99001979" className="bg-surface-3 border border-line rounded-xl px-4 py-3.5 hover:text-ink">
                                <div className="text-[12.5px] font-bold text-muted-soft">Монгол дугаар</div>
                                <div className="mt-1 text-[17px] font-extrabold text-ink">9900 1979</div>
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* 예약 모달 */}
            {isReservationModalOpen && (
                <div className="fixed inset-0 z-[60] bg-[rgba(9,14,24,0.55)] flex items-end justify-center lg:items-center lg:p-6">
                    <div className="w-full max-w-app max-h-[90vh] overflow-y-auto bg-surface rounded-t-[20px] animate-sheet-up lg:max-w-[480px] lg:rounded-[20px] lg:shadow-modal lg:animate-slide-up">
                        <div className="flex items-start justify-between gap-3.5 px-5 pt-[18px] pb-3.5 border-b border-line-soft lg:px-6 lg:pt-6 lg:pb-[18px]">
                            <div>
                                <div className="text-[17px] font-extrabold tracking-[-0.02em] lg:text-[19px]">Захиалга өгөх</div>
                                <div className="mt-1 text-[12.5px] font-medium text-muted lg:text-[13px]">
                                    Мэдээллээ үлдээгээрэй, ажлын 1 цагийн дотор холбогдоно.
                                </div>
                            </div>
                            <button
                                onClick={() => setIsReservationModalOpen(false)}
                                className="w-9 h-9 flex-none rounded-[10px] bg-surface-4 text-muted text-[15px]"
                            >
                                ✕
                            </button>
                        </div>

                        {reservationStatus === 'success' ? (
                            <div className="px-5 pt-[30px] pb-[26px] text-center lg:px-6 lg:pt-[34px]">
                                <div className="w-14 h-14 mx-auto rounded-full bg-primary-soft text-primary flex items-center justify-center text-[26px] font-extrabold">
                                    ✓
                                </div>
                                <div className="mt-4 text-[17px] font-extrabold lg:text-[19px]">Захиалга хүлээн авлаа</div>
                                <div className="mt-2 text-[13px] leading-[1.6] text-muted lg:text-[13.5px]">
                                    {product.name}
                                    <br />
                                    {reservationForm.phone} дугаарт холбогдоно.
                                </div>
                                <button
                                    onClick={() => {
                                        setIsReservationModalOpen(false);
                                        setReservationStatus('idle');
                                        setReservationForm({ userName: '', phone: '', facebookId: '' });
                                    }}
                                    className="mt-5 w-full h-12 rounded-xl border border-line-strong bg-surface text-[14.5px] font-bold text-ink"
                                >
                                    Хаах
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleReservationSubmit} className="px-5 pt-4 pb-6 lg:px-6 lg:pt-5 lg:pb-[26px]">
                                <div className="bg-surface-3 border border-line rounded-xl px-4 py-3.5 mb-4 lg:mb-5">
                                    <div className="text-[13.5px] font-extrabold lg:text-sm">{product.name}</div>
                                    <div className="mt-2 flex items-baseline justify-between gap-2.5">
                                        <span className="text-xs font-bold text-muted-strong lg:text-[12.5px]">Үнэ</span>
                                        <span className="text-base font-extrabold text-primary lg:text-[17px]">{product.price}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <label className="flex flex-col gap-[7px]">
                                        <span className="text-[12.5px] font-bold text-ink-soft">
                                            Нэр <span className="text-danger">*</span>
                                        </span>
                                        <input
                                            required
                                            value={reservationForm.userName}
                                            onChange={(e) => setReservationForm({ ...reservationForm, userName: e.target.value })}
                                            placeholder="Таны нэр"
                                            className="h-[50px] px-3.5 rounded-xl border border-line-strong text-sm font-medium text-ink outline-none box-border focus:border-primary lg:h-[46px] lg:rounded-[11px]"
                                        />
                                    </label>
                                    <label className="flex flex-col gap-[7px]">
                                        <span className="text-[12.5px] font-bold text-ink-soft">
                                            Утасны дугаар <span className="text-danger">*</span>
                                        </span>
                                        <input
                                            required
                                            type="tel"
                                            value={reservationForm.phone}
                                            onChange={(e) => setReservationForm({ ...reservationForm, phone: e.target.value })}
                                            placeholder="9900 1979"
                                            className="h-[50px] px-3.5 rounded-xl border border-line-strong text-sm font-medium text-ink outline-none box-border focus:border-primary lg:h-[46px] lg:rounded-[11px]"
                                        />
                                    </label>
                                    <label className="flex flex-col gap-[7px]">
                                        <span className="text-[12.5px] font-bold text-ink-soft">
                                            Facebook ID <span className="font-semibold text-muted-faint">(заавал биш)</span>
                                        </span>
                                        <input
                                            value={reservationForm.facebookId}
                                            onChange={(e) => setReservationForm({ ...reservationForm, facebookId: e.target.value })}
                                            placeholder="facebook.com/..."
                                            className="h-[50px] px-3.5 rounded-xl border border-line-strong text-sm font-medium text-ink outline-none box-border focus:border-primary lg:h-[46px] lg:rounded-[11px]"
                                        />
                                    </label>
                                </div>

                                {reservationStatus === 'error' && (
                                    <div className="mt-3.5 text-[12.5px] font-bold text-danger">Алдаа гарлаа. Дахин оролдоно уу.</div>
                                )}

                                <button
                                    type="submit"
                                    disabled={reservationStatus === 'submitting'}
                                    className="mt-[18px] w-full h-[52px] rounded-[13px] bg-primary text-white text-[15px] font-bold disabled:opacity-70 lg:h-[50px] lg:rounded-xl"
                                >
                                    {reservationStatus === 'submitting' ? 'Илгээж байна…' : 'Захиалгаа илгээх'}
                                </button>
                                <div className="mt-3 text-[11.5px] leading-[1.6] text-muted-faint text-center">
                                    Илгээснээр та Үйлчилгээний нөхцөл, Нууцлалын бодлогыг зөвшөөрч байна.
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
