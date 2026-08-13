import type { FunctionContext } from './_lib/auth';

const SITE_URL = 'https://www.temmun.mn';
const escapeXml = (value: string) => value.replace(/[<>&'"]/g, (character) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
}[character] || character));

const staticUrls = [
    { path: '/', frequency: 'daily', priority: '1.0' },
    { path: '/search', frequency: 'daily', priority: '0.9' },
    { path: '/about', frequency: 'monthly', priority: '0.5' },
    { path: '/terms', frequency: 'yearly', priority: '0.2' },
    { path: '/privacy', frequency: 'yearly', priority: '0.2' },
];

export const onRequestGet = async ({ env }: FunctionContext) => {
    let productIds: number[] = [];
    let categoryIds: number[] = [];
    try {
        const [products, categories] = await Promise.all([
            env.DB.prepare("SELECT id FROM products WHERE status != 'sold' ORDER BY created_at DESC").all<{ id: number }>(),
            env.DB.prepare('SELECT id FROM categories ORDER BY sort_order ASC, id ASC').all<{ id: number }>(),
        ]);
        productIds = products.results.map(({ id }) => id);
        categoryIds = categories.results.map(({ id }) => id);
    } catch {
        // Static routes remain indexable while D1 is temporarily unavailable.
    }

    const urls = [
        ...staticUrls.map(({ path, frequency, priority }) => ({ url: `${SITE_URL}${path}`, frequency, priority })),
        ...categoryIds.map((id) => ({ url: `${SITE_URL}/category/${id}`, frequency: 'daily', priority: '0.7' })),
        ...productIds.map((id) => ({ url: `${SITE_URL}/product/${id}`, frequency: 'weekly', priority: '0.8' })),
    ];
    const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(({ url, frequency, priority }) => `  <url><loc>${escapeXml(url)}</loc><changefreq>${frequency}</changefreq><priority>${priority}</priority></url>`).join('\n')}\n</urlset>`;

    return new Response(body, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
            'X-Content-Type-Options': 'nosniff',
        },
    });
};
