export async function onRequest(context: any) {
    const { env, request } = context;
    const db = env.DB;

    if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

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
        const data = await request.json();
        const { name, price, priceKRW, year, mileage, fuel, description, categoryId, status, images, isFeatured } = data;

        await db.prepare(`
            INSERT INTO products (name, price, priceKRW, year, mileage, fuel, description, categoryId, status, images, isFeatured)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(name, price, priceKRW, year, mileage, fuel, description, categoryId, status, JSON.stringify(images), isFeatured ? 1 : 0).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message || "Save Error" }), { status: 500 });
    }
}
