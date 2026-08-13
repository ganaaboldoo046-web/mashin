interface DataStatePanelProps {
    status: 'loading' | 'error';
    onRetry?: () => void;
    className?: string;
}

export default function DataStatePanel({ status, onRetry, className = '' }: DataStatePanelProps) {
    if (status === 'loading') {
        return (
            <div className={`bg-surface border border-line rounded-2xl px-5 py-10 text-center ${className}`} role="status" aria-live="polite">
                <div className="w-8 h-8 mx-auto border-4 border-line border-t-primary rounded-full animate-spin" aria-hidden="true" />
                <p className="mt-3 text-[13px] font-semibold text-muted">Мэдээлэл ачаалж байна…</p>
            </div>
        );
    }

    return (
        <div className={`bg-surface border border-danger/30 rounded-2xl px-5 py-9 text-center ${className}`} role="alert">
            <div className="text-[15px] font-extrabold text-ink">Мэдээлэл ачаалж чадсангүй</div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">Интернэт холболтоо шалгаад дахин оролдоно уу.</p>
            {onRetry && (
                <button onClick={onRetry} className="mt-4 h-11 px-5 rounded-[11px] bg-primary text-white text-[13.5px] font-bold">
                    Дахин оролдох
                </button>
            )}
        </div>
    );
}
