import type { FunctionContext } from './_lib/auth';

const DEFAULT_SITE_URL = 'https://dt-trading.kr';
const escapeXml = (value: string) => value.replace(/[<>&'"]/g, (character) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
}[character] || character));

const staticPaths = ['/', '/search', '/about', '/terms', '/privacy'];

const lastModified = (unixTime?: number) => {
    if (!unixTime || !Number.isFinite(unixTime)) return null;
    return new Date(unixTime * 1000).toISOString();
};

export const onRequestGet = async ({ env }: FunctionContext) => {
    const siteUrl = DEFAULT_SITE_URL;
    let products: Array<{ id: number; created_at?: number }> = [];
    let categoryIds: number[] = [];
    try {
        const [productRows, categories] = await Promise.all([
            env.DB.prepare("SELECT id, created_at FROM products WHERE status IN ('active', 'pending', 'discounted') ORDER BY created_at DESC").all<{ id: number; created_at?: number }>(),
            env.DB.prepare('SELECT id FROM categories ORDER BY sort_order ASC, id ASC').all<{ id: number }>(),
        ]);
        products = productRows.results;
        categoryIds = categories.results.map(({ id }) => id);
    } catch {
        // Static routes remain indexable while D1 is temporarily unavailable.
    }

    const urls = [
        ...staticPaths.map((path) => ({ url: `${siteUrl}${path}`, modified: null })),
        ...categoryIds.map((id) => ({ url: `${siteUrl}/category/${id}`, modified: null })),
        ...products.map(({ id, created_at }) => ({ url: `${siteUrl}/product/${id}`, modified: lastModified(created_at) })),
    ];
    const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(({ url, modified }) => `  <url><loc>${escapeXml(url)}</loc>${modified ? `<lastmod>${modified}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>`;

    return new Response(body, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
            'X-Content-Type-Options': 'nosniff',
        },
    });
};
