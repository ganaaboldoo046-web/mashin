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

let sessionSyncStarted = false;

export const refreshUserSession = async () => {
    try {
        const response = await fetch('/api/user_session', { headers: { Accept: 'application/json' } });
        if (response.ok) {
            const data = await response.json() as { user: AppUser };
            setUser(data.user);
        } else if (response.status === 401) {
            setUser(null);
        }
    } catch {
        // Keep the cached user during a temporary network outage.
    }
};

/** Subscribes to login/logout so the header and profile stay in sync across tabs. */
export function useUser() {
    const [user, setUserState] = useState<AppUser | null>(readUser);

    useEffect(() => {
        const sync = () => setUserState(readUser());
        window.addEventListener('authChanged', sync);
        window.addEventListener('storage', sync);
        if (!sessionSyncStarted) {
            sessionSyncStarted = true;
            void refreshUserSession();
        }
        return () => {
            window.removeEventListener('authChanged', sync);
            window.removeEventListener('storage', sync);
        };
    }, []);

    return user;
}
