import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error in ErrorBoundary:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-6 text-center">
                    <span className="material-symbols-outlined text-6xl text-red-500 mb-4 tracking-tighter">error</span>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Гэнэтийн алдаа гарлаа</h1>
                    <p className="text-slate-500 mb-8 max-w-sm">
                        Уучлаарай, ямар нэгэн зүйл буруугаар эргэлээ. Та хуудсаа дахин ачаална уу.
                    </p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-primary text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">refresh</span>
                        Дахин ачаалах
                    </button>
                    {import.meta.env.DEV && (
                        <div className="mt-8 p-4 bg-red-50 text-red-800 text-left rounded-lg text-xs max-w-full overflow-auto inline-block border border-red-200">
                            <strong>{this.state.error?.toString()}</strong>
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
