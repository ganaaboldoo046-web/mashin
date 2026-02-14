import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function SearchSection() {
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const [query, setQuery] = useState(initialQuery);
    const navigate = useNavigate();

    const handleSearch = () => {
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="px-4 py-4 bg-white dark:bg-background-dark">
            <label className="flex flex-col w-full">
                <div className="flex w-full items-center rounded-xl h-12 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <button
                        onClick={handleSearch}
                        className="text-primary flex items-center justify-center pl-4 pr-2 hover:text-blue-600 transition-colors"
                    >
                        <span className="material-symbols-outlined">search</span>
                    </button>
                    <input
                        className="form-input w-full border-none bg-transparent focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-500 text-sm font-medium px-2 outline-none"
                        placeholder="Та ямар машин хайж байна вэ?"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
            </label>
        </div>
    );
}
