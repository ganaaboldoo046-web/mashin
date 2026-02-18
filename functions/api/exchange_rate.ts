
interface Env {
    DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { env } = context;
    try {
        const stmt = env.DB.prepare("SELECT value FROM settings WHERE key = 'exchange_rate'");
        const result = await stmt.first();
        return new Response(JSON.stringify({
            rate: result ? parseFloat(result.value as string) : 2.5
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    try {
        const { rate } = await request.json() as { rate: number };

        if (!rate || isNaN(rate)) {
            return new Response(JSON.stringify({ error: 'Invalid rate' }), { status: 400 });
        }

        // 1. Update settings
        await env.DB.prepare("INSERT INTO settings (key, value, updated_at) VALUES ('exchange_rate', ?, strftime('%s', 'now')) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at")
            .bind(String(rate))
            .run();

        // 2. Mass update products price
        // Logic: price = (priceKRW * rate / 1,000,000) formatted as "XX.X сая ₮"
        // Note: We use SQLite's printf for formatting
        const updateQuery = `
            UPDATE products 
            SET price = printf('%.1f сая ₮', (CAST(priceKRW AS REAL) * ? / 1000000.0))
            WHERE priceKRW IS NOT NULL AND priceKRW > 0
        `;

        const result = await env.DB.prepare(updateQuery).bind(rate).run();

        return new Response(JSON.stringify({
            success: true,
            rate,
            updatedProducts: result.meta.changes
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
};
