export async function onRequest(context: any) {
    const { env, request } = context;
    const db = env.DB;

    try {
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                icon TEXT,
                image TEXT,
                count INTEGER DEFAULT 0
            )
        `).run();

        const data = await request.json();
        const { id, name, icon, image } = data;

        if (id) {
            await db.prepare(`
                UPDATE categories SET name = ?, icon = ?, image = ?
                WHERE id = ?
            `).bind(name, icon, image, id).run();
        } else {
            await db.prepare(`
                INSERT INTO categories (name, icon, image)
                VALUES (?, ?, ?)
            `).bind(name, icon, image).run();
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message || "Save Error" }), { status: 500 });
    }
}
