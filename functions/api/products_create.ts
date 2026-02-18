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
        const columns = ['engine', 'transmission', 'drive', 'color', 'interiorColor', 'doors', 'options'];
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
        const {
            id, name, price, priceKRW, year, mileage, fuel,
            description, categoryId, status, images, isFeatured,
            engine, transmission, drive, color, interiorColor, doors, options
        } = data;

        if (id) {
            // Update existing product
            await db.prepare(`
                UPDATE products SET
                    name = ?, price = ?, priceKRW = ?, year = ?, mileage = ?, fuel = ?, 
                    description = ?, categoryId = ?, status = ?, images = ?, isFeatured = ?,
                    engine = ?, transmission = ?, drive = ?, color = ?, interiorColor = ?, doors = ?, options = ?
                WHERE id = ?
            `).bind(
                name, price, priceKRW, year, mileage, fuel,
                description, categoryId, status, JSON.stringify(images), isFeatured ? 1 : 0,
                engine || null, transmission || null, drive || null, color || null, interiorColor || null, doors || null,
                options ? JSON.stringify(options) : null,
                id
            ).run();
        } else {
            // Insert new product
            await db.prepare(`
                INSERT INTO products (
                    name, price, priceKRW, year, mileage, fuel, 
                    description, categoryId, status, images, isFeatured,
                    engine, transmission, drive, color, interiorColor, doors, options
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
                name, price, priceKRW, year, mileage, fuel,
                description, categoryId, status, JSON.stringify(images), isFeatured ? 1 : 0,
                engine || null, transmission || null, drive || null, color || null, interiorColor || null, doors || null,
                options ? JSON.stringify(options) : null
            ).run();
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message || "Save Error" }), { status: 500 });
    }
}
