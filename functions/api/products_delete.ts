export async function onRequest(context: any) {
    const { env, request } = context;
    const db = env.DB;

    if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    // Defensive: Create table if missing & ensure all columns exist
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

        // Migration: Add missing columns if they don't exist
        const columns = ['engine', 'transmission', 'drive', 'color', 'interiorColor', 'doors'];
        for (const col of columns) {
            try {
                await db.prepare(`ALTER TABLE products ADD COLUMN ${col} TEXT`).run();
            } catch (e) {
                // Column probably already exists
            }
        }
    } catch (e: any) {
        console.error("Product table initialization/migration failed:", e);
    }

    try {
        const data = await request.json();
        const { id } = data;

        if (!id) return new Response("Missing ID", { status: 400 });

        await db.prepare("DELETE FROM products WHERE id = ?").bind(id).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message || "Delete Error" }), { status: 500 });
    }
}
