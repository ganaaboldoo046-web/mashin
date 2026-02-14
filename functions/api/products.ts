export async function onRequest(context: any) {
    const { env, request } = context;
    const db = env.DB;

    // Defensive: Create table if missing
    try {
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                price TEXT NOT NULL,
                priceKRW INTEGER,
                year TEXT,
                mileage TEXT,
                fuel TEXT,
                description TEXT,
                categoryId INTEGER,
                status TEXT DEFAULT 'active',
                images TEXT,
                isFeatured BOOLEAN DEFAULT 0,
                created_at INTEGER DEFAULT (strftime('%s', 'now'))
            )
        `).run();
    } catch (e: any) {
        console.error("Product table creation failed:", e);
    }

    try {
        const { results } = await db.prepare("SELECT * FROM products ORDER BY created_at DESC").all();
        return new Response(JSON.stringify(results || []), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message || "DB Error" }), { status: 500 });
    }
}
