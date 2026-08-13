import type { FunctionContext } from '../_lib/auth';

interface BannerImageRow {
    image: string;
}

const imageNameFromPath = (image: string) => {
    try {
        const pathname = new URL(image, 'https://dt-trading.kr').pathname;
        const prefix = '/api/images/';
        if (!pathname.startsWith(prefix)) return null;
        return decodeURIComponent(pathname.slice(prefix.length));
    } catch {
        return null;
    }
};

export async function onRequest(context: FunctionContext) {
    const { env } = context;
    if (!env.BUCKET) return new Response('Image storage is not configured', { status: 503 });

    try {
        const banner = await env.DB.prepare(
            'SELECT image FROM banners WHERE active = 1 AND image IS NOT NULL AND image != ? ORDER BY id ASC LIMIT 1'
        ).bind('').first<BannerImageRow>();
        const name = banner?.image ? imageNameFromPath(banner.image) : null;
        if (!name) return new Response('Banner image not found', { status: 404 });

        const object = await env.BUCKET.get(name);
        if (!object) return new Response('Banner image not found', { status: 404 });

        const headers = new Headers();
        if (object.httpMetadata?.contentType) headers.set('Content-Type', object.httpMetadata.contentType);
        headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=86400');
        headers.set('X-Content-Type-Options', 'nosniff');
        return new Response(object.body, { headers });
    } catch {
        return new Response('Banner image unavailable', { status: 503 });
    }
}
