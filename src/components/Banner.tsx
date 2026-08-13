import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Image from './Image';
import { getBanners, type Banner as BannerType } from '../utils/storage';
import { DT_CONTACT } from '../constants/contact';

/** 배너가 하나도 없을 때 노출되는 기본 히어로 카피. */
const FALLBACK: BannerType = {
    id: 0,
    title: 'Солонгосоос шууд, шалгагдсан автомашин',
    subtitle: 'Гааль, тээвэр, бүртгэл — бүгд багцад.',
    image: '',
    active: true,
};

const SLIDE_MS = 5000;

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

export default function Banner() {
    const banners = useBanners();
    const trackRef = useRef<HTMLDivElement>(null);
    const paused = useRef(false);
    const [slide, setSlide] = useState(0);

    /** 슬라이드 하나 = 카드 너비 + 간격. 좌우 패딩 덕에 snap-center 로 가운데 정렬된다. */
    const scrollToSlide = useCallback((index: number) => {
        const track = trackRef.current;
        if (!track) return;
        const first = track.firstElementChild as HTMLElement | null;
        if (!first) return;
        const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
        track.scrollTo({ left: index * (first.getBoundingClientRect().width + gap), behavior: 'smooth' });
    }, []);

    const go = (index: number) => {
        const next = (index + banners.length) % banners.length;
        setSlide(next);
        scrollToSlide(next);
    };

    useEffect(() => {
        if (banners.length < 2) return;
        const timer = setInterval(() => {
            if (paused.current) return;
            setSlide((current) => {
                const next = (current + 1) % banners.length;
                scrollToSlide(next);
                return next;
            });
        }, SLIDE_MS);
        return () => clearInterval(timer);
    }, [banners.length, scrollToSlide]);

    if (banners.length === 0) return null;

    return (
        <section
            className="mt-4 lg:mt-0 lg:mb-10"
            onMouseEnter={() => (paused.current = true)}
            onMouseLeave={() => (paused.current = false)}
        >
            {/* 좌우 패딩이 이웃 슬라이드를 살짝 드러내는 peek 역할을 한다 */}
            <div
                ref={trackRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar px-7 lg:px-[72px]"
                onScroll={(e) => {
                    const track = e.currentTarget;
                    const first = track.firstElementChild as HTMLElement | null;
                    if (!first) return;
                    const step = first.getBoundingClientRect().width + 16;
                    const index = Math.round(track.scrollLeft / step);
                    setSlide((current) => (current === index ? current : index));
                }}
            >
                {banners.map((banner, i) => (
                    <div
                        key={banner.id}
                        className={`relative flex-none snap-center w-[calc(100%-56px)] lg:w-[calc(100%-144px)] rounded-[18px] lg:rounded-[20px] overflow-hidden bg-hero-mobile lg:bg-hero-desktop px-[22px] pt-6 pb-[22px] lg:h-[340px] lg:px-[52px] lg:py-12 lg:flex lg:flex-col lg:justify-center transition-opacity duration-300 ${
                            i === slide ? 'opacity-100' : 'opacity-50'
                        }`}
                    >
                        {banner.image && (
                            <>
                                <Image
                                    src={banner.image}
                                    alt={banner.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    size="full"
                                    priority={i === 0}
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40" />
                            </>
                        )}
                        <div className="relative flex flex-col items-start">
                            <span className="text-[10.5px] lg:text-[11.5px] font-extrabold tracking-[0.14em] text-[#FF8A80] bg-primary/20 px-2.5 py-1.5 rounded-md">
                                DT Trading
                            </span>
                            <h2 className="mt-2.5 lg:mt-5 mb-0 lg:mb-3 text-[22px] lg:text-[42px] font-extrabold leading-[1.3] lg:leading-[1.18] tracking-[-0.02em] lg:tracking-[-0.03em] text-white lg:max-w-[15ch] text-balance">
                                {banner.title}
                            </h2>
                            {banner.subtitle && (
                                <p className="mt-2 lg:mt-0 lg:mb-7 text-[12.5px] lg:text-[15px] leading-[1.55] lg:leading-[1.6] text-white/[0.72] lg:max-w-[46ch]">
                                    {banner.subtitle}
                                </p>
                            )}
                            <div className="mt-4 lg:mt-0 flex gap-2.5">
                                <Link
                                    to="/search"
                                    className="h-11 lg:h-12 px-5 lg:px-6 inline-flex items-center rounded-xl bg-primary text-white text-sm lg:text-[14.5px] font-bold hover:text-white"
                                >
                                    Машин үзэх
                                </Link>
                                <a
                                    href={DT_CONTACT.primary.href}
                                    className="hidden lg:inline-flex h-12 px-6 items-center rounded-xl border border-white/25 text-white text-[14.5px] font-bold hover:text-white"
                                >
                                    Холбоо барих
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {banners.length > 1 && (
                <div className="mt-4 flex items-center justify-center gap-3">
                    <button
                        onClick={() => go(slide - 1)}
                        aria-label="Өмнөх"
                        className="hidden lg:flex w-9 h-9 rounded-full border border-line bg-surface text-muted items-center justify-center text-sm"
                    >
                        ‹
                    </button>
                    <div className="flex items-center gap-2">
                        {banners.map((banner, i) => (
                            <button
                                key={banner.id}
                                onClick={() => go(i)}
                                aria-label={`${i + 1}-р баннер`}
                                className={`h-1.5 rounded-full transition-all ${i === slide ? 'w-7 bg-primary' : 'w-1.5 bg-line-2'}`}
                            />
                        ))}
                    </div>
                    <button
                        onClick={() => go(slide + 1)}
                        aria-label="Дараах"
                        className="hidden lg:flex w-9 h-9 rounded-full border border-line bg-surface text-muted items-center justify-center text-sm"
                    >
                        ›
                    </button>
                </div>
            )}
        </section>
    );
}
