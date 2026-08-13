const ITEMS = [
    'Бүх машин ослын түүх шалгасан',
    '1 жилийн үнэгүй баталгаа',
    'Гааль, тээвэр багцад',
    'Улаанбаатарт хүргэлт',
    'Ханш өдөр бүр шинэчлэгдэнэ',
];

/** 데스크탑 상단 신뢰 배지 마퀴 (모바일에서는 숨김). */
export default function TopTicker() {
    return (
        <div className="hidden lg:block bg-night overflow-hidden">
            <div className="flex w-[200%] animate-marquee">
                {[...ITEMS, ...ITEMS].map((label, i) => (
                    <div
                        key={`${label}-${i}`}
                        className="flex-1 flex items-center justify-center gap-2 h-[42px] text-muted-strong text-[12.5px] font-bold whitespace-nowrap"
                    >
                        <span className="text-accent-soft">✓</span>
                        {label}
                    </div>
                ))}
            </div>
        </div>
    );
}
