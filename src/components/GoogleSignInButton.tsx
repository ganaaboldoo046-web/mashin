import { lazy, Suspense } from 'react';
import type { AppUser } from '../hooks/useUser';

interface GoogleSignInButtonProps {
    onAuthenticated?: (user: AppUser) => void;
    className?: string;
}

const GoogleSignInImplementation = lazy(() => import('./GoogleSignInImplementation'));

export default function GoogleSignInButton(props: GoogleSignInButtonProps) {
    return (
        <Suspense
            fallback={(
                <div className={`flex h-11 w-full max-w-[320px] items-center justify-center rounded-full border border-slate-300 bg-white text-sm font-semibold text-slate-700 ${props.className ?? ''}`}>
                    Google нэвтрэхийг ачаалж байна...
                </div>
            )}
        >
            <GoogleSignInImplementation {...props} />
        </Suspense>
    );
}
