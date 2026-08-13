import { useState } from 'react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { setUser, type AppUser } from '../hooks/useUser';

interface GoogleSignInButtonProps {
    onAuthenticated?: (user: AppUser) => void;
    className?: string;
}

export default function GoogleSignInButton({ onAuthenticated, className = '' }: GoogleSignInButtonProps) {
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isConfigured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim());

    const authenticate = async (response: CredentialResponse) => {
        if (!response.credential) {
            setError('Google нэвтрэх мэдээлэл ирсэнгүй. Дахин оролдоно уу.');
            return;
        }

        setError('');
        setIsSubmitting(true);
        try {
            const result = await fetch('/api/auth_google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential: response.credential }),
            });
            const data = await result.json().catch(() => null) as { user?: AppUser; error?: string } | null;
            if (!result.ok || !data?.user) throw new Error(data?.error || 'Google authentication failed');

            setUser(data.user);
            onAuthenticated?.(data.user);
        } catch (loginError) {
            console.error('Google login failed:', loginError);
            setError('Google-ээр нэвтрэх боломжгүй байна. Түр хүлээгээд дахин оролдоно уу.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isConfigured) {
        return <p role="alert" className={`text-sm text-red-300 ${className}`}>Google нэвтрэх тохиргоо хийгдээгүй байна.</p>;
    }

    return (
        <div className={`flex flex-col items-center gap-2 ${className}`}>
            <div className={isSubmitting ? 'pointer-events-none opacity-60' : ''}>
                <GoogleLogin
                    onSuccess={authenticate}
                    onError={() => setError('Google нэвтрэх цонхыг нээж чадсангүй. Дахин оролдоно уу.')}
                    shape="pill"
                    size="large"
                    theme="outline"
                    text="signin_with"
                    width="320"
                />
            </div>
            {isSubmitting && <p className="text-xs text-slate-300">Нэвтэрч байна...</p>}
            {error && <p role="alert" className="max-w-xs text-xs text-red-300">{error}</p>}
        </div>
    );
}
