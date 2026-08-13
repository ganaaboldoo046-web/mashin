import { useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'temmun_theme';

export const readTheme = (): Theme => {
    try {
        return localStorage.getItem(THEME_STORAGE_KEY) === 'light' ? 'light' : 'dark';
    } catch {
        return 'dark';
    }
};

export const applyTheme = (theme: Theme) => {
    document.documentElement.setAttribute('data-theme', theme);
};

/** 다크가 기본. 선택은 저장되고 열려 있는 다른 탭에도 반영된다. */
export function useTheme() {
    const [theme, setTheme] = useState<Theme>(readTheme);

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    useEffect(() => {
        const sync = () => setTheme(readTheme());
        window.addEventListener('themeChanged', sync);
        window.addEventListener('storage', sync);
        return () => {
            window.removeEventListener('themeChanged', sync);
            window.removeEventListener('storage', sync);
        };
    }, []);

    const toggle = () => {
        const next: Theme = readTheme() === 'dark' ? 'light' : 'dark';
        try {
            localStorage.setItem(THEME_STORAGE_KEY, next);
        } catch {
            /* private mode — 세션 동안만 적용 */
        }
        applyTheme(next);
        setTheme(next);
        window.dispatchEvent(new Event('themeChanged'));
    };

    return { theme, toggle };
}
