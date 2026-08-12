import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

/** 모바일 홈 상단 검색창. 데스크탑은 헤더 안의 검색창을 쓰므로 숨긴다. */
export default function SearchSection() {
    const [searchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const navigate = useNavigate();

    const handleSearch = () => {
        navigate(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : '/search');
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div className="lg:hidden px-4 pt-4">
            <div className="flex items-center gap-2.5 h-12 px-3.5 rounded-[14px] bg-surface border border-line">
                <button onClick={handleSearch} aria-label="Хайх" className="text-muted-faint text-base leading-none">
                    ⌕
                </button>
                <input
                    className="flex-1 min-w-0 border-0 outline-none bg-transparent text-sm font-medium text-ink placeholder:text-muted-faint"
                    placeholder="Та ямар машин хайж байна?"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                {query && (
                    <button onClick={() => setQuery('')} aria-label="Цэвэрлэх" className="text-muted-faint text-sm leading-none">
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
}
