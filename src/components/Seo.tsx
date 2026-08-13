import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://www.temmun.mn').replace(/\/$/, '');

const ROUTE_META: Record<string, { title: string; description: string; noIndex?: boolean }> = {
    '/': {
        title: 'DT Trading — Солонгосоос шалгагдсан автомашин',
        description: 'Солонгосоос шалгагдсан автомашиныг үнэ, гүйлт, он, түлшээр хайж захиалаарай. Гааль, тээвэр, бүртгэлийн нэгдсэн үйлчилгээ.',
    },
    '/search': {
        title: 'Автомашин хайх | DT Trading',
        description: 'Бэлэн болон захиалгын автомашинуудыг брэнд, үнэ, үйлдвэрлэсэн он, гүйлт, түлшээр шүүн хайх.',
    },
    '/about': {
        title: 'Бидний тухай | DT Trading',
        description: 'DT Trading-ийн Солонгос–Монгол автомашин импорт, шалгалт, тээврийн үйлчилгээний тухай.',
    },
    '/terms': { title: 'Үйлчилгээний нөхцөл | DT Trading', description: 'DT Trading үйлчилгээний нөхцөл.' },
    '/privacy': { title: 'Нууцлалын бодлого | DT Trading', description: 'DT Trading хувийн мэдээлэл хамгаалах бодлого.' },
    '/saved': { title: 'Хадгалсан зар | DT Trading', description: 'Таны хадгалсан автомашинууд.', noIndex: true },
    '/profile': { title: 'Профайл | DT Trading', description: 'DT Trading хэрэглэгчийн профайл.', noIndex: true },
};

const setMeta = (selector: string, attributes: Record<string, string>) => {
    let element = document.head.querySelector<HTMLMetaElement>(selector);
    if (!element) {
        element = document.createElement('meta');
        document.head.appendChild(element);
    }
    Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value));
};

export default function Seo() {
    const location = useLocation();

    useEffect(() => {
        const basePath = location.pathname.startsWith('/product/')
            ? '/product'
            : location.pathname.startsWith('/category/')
                ? '/category'
                : location.pathname;
        const meta = ROUTE_META[basePath] || {
            title: 'DT Trading — Автомашин худалдаа',
            description: 'Солонгосоос шалгагдсан автомашины худалдаа, захиалга, тээврийн үйлчилгээ.',
            noIndex: basePath.startsWith('/admin'),
        };
        const canonicalUrl = `${SITE_URL}${location.pathname === '/' ? '/' : location.pathname}`;

        document.title = meta.title;
        document.documentElement.lang = 'mn';
        setMeta('meta[name="description"]', { name: 'description', content: meta.description });
        setMeta('meta[name="robots"]', { name: 'robots', content: meta.noIndex ? 'noindex, nofollow' : 'index, follow' });
        setMeta('meta[property="og:title"]', { property: 'og:title', content: meta.title });
        setMeta('meta[property="og:description"]', { property: 'og:description', content: meta.description });
        setMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
        setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: meta.title });
        setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: meta.description });

        let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = canonicalUrl;
    }, [location.pathname]);

    return null;
}
