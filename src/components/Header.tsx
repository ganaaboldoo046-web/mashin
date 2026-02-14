

export default function Header() {
    return (
        <header className="sticky top-0 z-50 flex items-center bg-white dark:bg-background-dark px-4 py-3 justify-between border-b border-slate-200 dark:border-slate-800">
            <h1 className="text-primary text-xl font-bold leading-tight tracking-tight flex-1">Somang Trading</h1>
            <div className="flex items-center gap-4">
                <button className="p-1">
                    <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">notifications</span>
                </button>
                <button className="flex items-center justify-center h-10 w-10 bg-transparent text-slate-900 dark:text-white">
                    <span className="material-symbols-outlined text-2xl">menu</span>
                </button>
            </div>
        </header>
    );
}
