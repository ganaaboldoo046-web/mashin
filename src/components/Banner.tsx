import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Image from './Image';
import { getBanners, getExchangeRate, type Banner as BannerType } from '../utils/storage';

/** 배너가 하나도 없을 때 노출되는 기본 히어로 카피. */
const FALLBACK: BannerType = {
    id: 0,
    title: 'Солонгосоос шууд, шалгагдсан автомашин',
    subtitle: 'Гааль, тээвэр, бүртгэл — бүгд багцад.',
    image: '',
    active: true,
};

function useBanners() {
    const [banners, setBanners] = useState<BannerType[]>([]);

    useEffect(() => {
        const load = async () => {
            const all = await getBanners();
            const active = all.filter((b) => b.active !== false);
            setBanners(active.length > 0 ? active : [FALLBACK]);
        };
        load();
        window.addEventListener('storageBanners', load);
        return () => window.removeEventListener('storageBanners', load);
    }, []);

    return banners;
}

function useExchangeRate() {
    const [rate, setRate] = useState<number>(() => getExchangeRate().krwToMnt);

    useEffect(() => {
        let alive = true;
        fetch('/api/exchange_rate')
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (alive && data && typeof data.rate === 'number') setRate(data.rate);
            })
            .catch(() => undefined);
        return () => {
            alive = false;
        };
    }, []);

    return rate;
}

function HeroCopy({ banner, size }: { banner: BannerType; size: 'mobile' | 'desktop' }) {
    const isDesktop = size === 'desktop';
    return (
        <>
            <span
                className={
                    isDesktop
                        ? 'self-start text-[11.5px] font-extrabold tracking-[0.14em] text-[#7fa9ff] bg-primary/[0.16] px-3 py-[7px] rounded-md'
                        : 'text-[10.5px] font-extrabold tracking-[0.14em] text-[#7fa9ff]'
                }
            >
                TEMMUN TRADING
            </span>
            <h2
                className={
                    isDesktop
                        ? 'mt-5 mb-3 text-[42px] leading-[1.18] font-extrabold tracking-[-0.03em] text-white max-w-[15ch] text-balance'
                        : 'mt-2.5 text-[22px] font-extrabold leading-[1.3] tracking-[-0.02em] text-white'
                }
            >
                {banner.title}
            </h2>
            {banner.subtitle && (
                <p
                    className={
                        isDesktop
                            ? 'm-0 mb-7 text-[15px] leading-[1.6] text-[#a9b6cc] max-w-[46ch]'
                            : 'mt-2 text-[12.5px] leading-[1.55] text-[#a9b6cc]'
                    }
                >
                    {banner.subtitle}
                </p>
            )}
        </>
    );
}

export default function Banner() {
    const banners = useBanners();
    const rate = useExchangeRate();
    const [active, setActive] = useState(0);

    if (banners.length === 0) return null;
    const lead = banners[0];

    return (
        <>
            {/* 모바일 히어로 캐러셀 */}
            <section className="lg:hidden mt-4">
                <div
                    className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar px-4"
                    onScroll={(e) => {
                        const el = e.currentTarget;
                        setActive(Math.round(el.scrollLeft / (el.clientWidth * 0.85 + 16)));
                    }}
                >
                    {banners.map((banner) => (
                        <div
                            key={banner.id}
                            className="relative flex-none shrink-0 w-[calc(100%-8px)] snap-center rounded-[18px] overflow-hidden bg-hero-mobile px-[22px] pt-6 pb-[22px]"
                        >
                            {banner.image && (
                                <>
                                    <Image
                                        src={banner.image}
                                        alt={banner.title}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        size="medium"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-night via-night/80 to-night/40" />
                                </>
                            )}
                            <div className="relative">
                                <HeroCopy banner={banner} size="mobile" />
                                <Link
                                    to="/search"
                                    className="mt-4 inline-flex items-center h-11 px-5 rounded-xl bg-primary text-white text-sm font-bold hover:text-white"
                                >
                                    Машин үзэх
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                {banners.length > 1 && (
                    <div className="flex justify-center gap-2 mt-3">
                        {banners.map((banner, i) => (
                            <span
                                key={banner.id}
                                className={`w-2 h-2 rounded-full ${i === active ? 'bg-primary' : 'bg-[#d5d9e0]'}`}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* 데스크탑 히어로 + 사이드 카드 */}
            <section className="hidden lg:grid grid-cols-[1fr_340px] gap-4 mb-10">
                <div className="relative rounded-[20px] overflow-hidden bg-hero-desktop min-h-[340px] flex flex-col justify-center px-[52px] py-12">
                    {lead.image && (
                        <>
                            <Image
                                src={lead.image}
                                alt={lead.title}
                                className="absolute inset-0 w-full h-full object-cover"
                                size="full"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-night via-night/85 to-night/40" />
                        </>
                    )}
                    <div className="relative flex flex-col">
                        <HeroCopy banner={lead} size="desktop" />
                        <div className="flex gap-2.5">
                            <Link
                                to="/search"
                                className="h-12 px-6 inline-flex items-center rounded-xl bg-primary text-white text-[14.5px] font-bold hover:text-white"
                            >
                                Машин үзэх
                            </Link>
                            <a
                                href="tel:01057279927"
                                className="h-12 px-6 inline-flex items-center rounded-xl border border-white/25 text-white text-[14.5px] font-bold hover:text-white"
                            >
                                Холбоо барих
                            </a>
                        </div>
                    </div>
                </div>

                <div className="grid grid-rows-2 gap-4">
                    <div className="rounded-[20px] bg-surface border border-line p-6 flex flex-col justify-between">
                        <div>
                            <div className="text-[13px] font-bold text-primary">Өнөөдрийн ханш</div>
                            <div className="mt-2.5 text-[30px] font-extrabold tracking-[-0.02em]">
                                ₮{rate}
                                <span className="text-[15px] font-bold text-muted"> / 1₩</span>
                            </div>
                        </div>
                        <div className="text-[12.5px] text-muted">Үнэ бүр өнөөдрийн ханшаар автоматаар шинэчлэгдэнэ.</div>
                    </div>
                    <div className="rounded-[20px] bg-night p-6 flex flex-col justify-between">
                        <div className="text-[19px] font-extrabold text-white leading-[1.35]">
                            Бүх машин
                            <br />1 жилийн баталгаа
                        </div>
                        <div className="text-[12.5px] text-night-text">Хүргэлт, гааль, бүртгэл — бүгд багцад.</div>
                    </div>
                </div>
            </section>
        </>
    );
}
