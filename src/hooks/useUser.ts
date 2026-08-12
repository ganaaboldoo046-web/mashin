import { useEffect, useState } from 'react';

export interface AppUser {
    email: string;
    name: string;
    avatar?: string;
    googleId?: string;
    phone?: string;
}

export const USER_STORAGE_KEY = 'somang_user';

export const readUser = (): AppUser | null => {
    try {
        const stored = localStorage.getItem(USER_STORAGE_KEY);
        return stored ? (JSON.parse(stored) as AppUser) : null;
    } catch {
        return null;
    }
};

export const setUser = (user: AppUser | null) => {
    if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(USER_STORAGE_KEY);
    }
    window.dispatchEvent(new Event('authChanged'));
};

/** Subscribes to login/logout so the header and profile stay in sync across tabs. */
export function useUser() {
    const [user, setUserState] = useState<AppUser | null>(readUser);

    useEffect(() => {
        const sync = () => setUserState(readUser());
        window.addEventListener('authChanged', sync);
        window.addEventListener('storage', sync);
        return () => {
            window.removeEventListener('authChanged', sync);
            window.removeEventListener('storage', sync);
        };
    }, []);

    return user;
}
