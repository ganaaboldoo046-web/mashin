import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { setCanonical, setMeta } from '../utils/seo';

const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://dt-trading.kr').replace(/\/$/, '');
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

const ROUTE_META: Record<string, { title: string; description: string; noIndex?: boolean }> = {
    '/': {
        title: 'DT Trading',
        description: 'DT Trading нь БНСУ-аас шалгагдсан автомашин хайх, захиалах, худалдан авахад тусалж, тээвэр, гааль, бүртгэлийн нэгдсэн үйлчилгээ үзүүлнэ.',
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
    '/product': { title: 'Автомашины дэлгэрэнгүй | DT Trading', description: 'DT Trading-ийн шалгагдсан автомашины үзүүлэлт, үнэ болон захиалгын мэдээлэл.' },
    '/category': { title: 'Автомашины ангилал | DT Trading', description: 'DT Trading-ийн автомашинуудыг ангиллаар харах.' },
    '/sell': { title: 'Машин зарах | DT Trading', description: 'DT Trading машин зарах үйлчилгээ.', noIndex: true },
    '/saved': { title: 'Хадгалсан зар | DT Trading', description: 'Таны хадгалсан автомашинууд.', noIndex: true },
    '/profile': { title: 'Профайл | DT Trading', description: 'DT Trading хэрэглэгчийн профайл.', noIndex: true },
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
        setMeta('meta[property="og:image"]', { property: 'og:image', content: DEFAULT_IMAGE });
        setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: meta.title });
        setMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: meta.description });
        setMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: DEFAULT_IMAGE });

        setCanonical(canonicalUrl);
    }, [location.pathname]);

    return null;
}
