import { memo } from 'react';
import { Link } from 'react-router-dom';
import Image from './Image';
import { carMeta, formatKRW, STATUS_LABELS } from '../utils/format';
import { isSaved, toggleSaved } from '../utils/storage';
import type { Product } from '../utils/storage';

type Variant = 'grid' | 'row' | 'mini';

interface CarCardProps {
    product: Product;
    variant?: Variant;
    /** Renders the ♡ toggle. Off for the mini carousel cards, matching the design. */
    savable?: boolean;
    /** Kept in sync by the parent so a toggle re-renders the whole list at once. */
    savedIds?: number[];
    priority?: boolean;
}

const ASPECT: Record<Variant, string> = {
    grid: 'aspect-[16/10]',
    row: '',
    mini: 'aspect-[4/3]',
};

function Photo({ product, variant, priority }: { product: Product; variant: Variant; priority?: boolean }) {
    const src = product.images?.[0];
    return (
        <div className={`relative bg-photo flex items-center justify-center overflow-hidden ${ASPECT[variant]}`}>
            {src ? (
                <Image
                    src={src}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    size={variant === 'grid' ? 'medium' : 'thumbnail'}
                    priority={priority}
                />
            ) : (
                <span className="text-[11px] font-bold tracking-[0.1em] text-placeholder">ЗУРАГ</span>
            )}
            {product.status !== 'active' && (
                <div className="absolute inset-0 bg-night/45 flex items-center justify-center">
                    <span className="text-white text-xs font-bold px-3 py-1 rounded-full bg-night/70">
                        {STATUS_LABELS[product.status]}
                    </span>
                </div>
            )}
        </div>
    );
}

function SaveButton({ id, saved, className }: { id: number; saved: boolean; className: string }) {
    return (
        <button
            type="button"
            aria-label="Хадгалах"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSaved(id);
            }}
            className={`${className} rounded-full flex items-center justify-center transition-colors ${saved ? 'text-danger' : 'text-[#94a0b2]'}`}
        >
            <span className="text-[17px] leading-none">{saved ? '♥' : '♡'}</span>
        </button>
    );
}

const CarCard = memo(function CarCard({
    product,
    variant = 'grid',
    savable = true,
    savedIds,
    priority,
}: CarCardProps) {
    const saved = savedIds ? savedIds.includes(product.id) : isSaved(product.id);
    const meta = carMeta(product);
    const krw = formatKRW(product.priceKRW);

    if (variant === 'row') {
        return (
            <Link
                to={`/product/${product.id}`}
                className="flex gap-3.5 bg-surface border border-line rounded-2xl p-3 text-ink hover:text-ink transition-colors hover:border-[#c9d3e4]"
            >
                <div className="w-[118px] h-[88px] flex-none rounded-xl overflow-hidden bg-photo flex items-center justify-center">
                    {product.images?.[0] ? (
                        <Image src={product.images[0]} alt={product.name} className="w-full h-full object-cover" size="thumbnail" />
                    ) : (
                        <span className="text-[10px] font-bold tracking-[0.1em] text-placeholder">ЗУРАГ</span>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate">{product.name}</div>
                    <div className="mt-1 text-xs font-medium text-muted truncate">{meta}</div>
                    <div className="mt-2 text-[15px] font-extrabold text-primary">{product.price}</div>
                    {krw && <div className="mt-0.5 text-[11.5px] font-semibold text-muted">Солонгост {krw}</div>}
                </div>
                {savable && <SaveButton id={product.id} saved={saved} className="w-11 h-11 flex-none bg-surface-2" />}
            </Link>
        );
    }

    if (variant === 'mini') {
        return (
            <Link
                to={`/product/${product.id}`}
                className="flex-none w-[190px] lg:w-auto bg-surface border border-line rounded-[14px] overflow-hidden text-ink hover:text-ink transition-colors hover:border-[#c9d3e4]"
            >
                <Photo product={product} variant="mini" />
                <div className="px-[13px] pt-3 pb-3.5">
                    <div className="text-[13px] font-bold tracking-[-0.01em] truncate">{product.name}</div>
                    <div className="mt-1 text-[11.5px] font-medium text-muted truncate">{meta}</div>
                    <div className="mt-2 text-[14.5px] font-extrabold text-primary lg:text-[15px]">{product.price}</div>
                </div>
            </Link>
        );
    }

    return (
        <Link
            to={`/product/${product.id}`}
            className="block bg-surface border border-line rounded-2xl overflow-hidden text-ink hover:text-ink transition-colors hover:border-[#c9d3e4]"
        >
            <div className="relative">
                <Photo product={product} variant="grid" priority={priority} />
                {savable && (
                    <SaveButton
                        id={product.id}
                        saved={saved}
                        className="absolute top-2.5 right-2.5 w-11 h-11 bg-white/90 backdrop-blur-sm"
                    />
                )}
            </div>
            <div className="px-4 pt-3.5 pb-4 lg:px-[18px] lg:pb-[18px]">
                <div className="text-[15px] font-bold tracking-[-0.01em] lg:text-[15.5px]">{product.name}</div>
                <div className="mt-1.5 text-[12.5px] font-medium text-muted lg:text-[13px]">{meta}</div>
                <div className="mt-2.5 text-[17px] font-extrabold text-primary lg:text-[18px]">{product.price}</div>
                {krw && (
                    <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11.5px] font-bold text-muted-strong bg-[#eef1f6] rounded-[5px] px-[7px] py-[3px] whitespace-nowrap">
                            Солонгост
                        </span>
                        <span className="text-[13.5px] font-extrabold whitespace-nowrap">{krw}</span>
                    </div>
                )}
            </div>
        </Link>
    );
});

export default CarCard;
