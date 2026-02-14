export async function onRequest(context: any) {
    const { env, request } = context;
    const db = env.DB;

    if (request.method === "GET") {
        try {
            // Defensive: Create table if it doesn't exist
            await db.prepare(`
                CREATE TABLE IF NOT EXISTS banners (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT,
                    subtitle TEXT,
                    image TEXT,
                    bg TEXT,
                    active BOOLEAN DEFAULT 1
                )
            `).run();

            const { results } = await db.prepare("SELECT * FROM banners").all();
            return new Response(JSON.stringify(results), {
                headers: { "Content-Type": "application/json" }
            });
        } catch (err: any) {
            return new Response(JSON.stringify({ error: err.message || "DB Error" }), { status: 500 });
        }
    }

    if (request.method === "POST") {
        try {
            const data = await request.json();
            const { id, title, subtitle, image, bg, active } = data;

            if (id) {
                await db.prepare(`
                    UPDATE banners SET title = ?, subtitle = ?, image = ?, bg = ?, active = ?
                    WHERE id = ?
                `).bind(title, subtitle, image, bg, active ? 1 : 0, id).run();
            } else {
                await db.prepare(`
                    INSERT INTO banners (title, subtitle, image, bg, active)
                    VALUES (?, ?, ?, ?, ?)
                `).bind(title, subtitle, image, bg, active ? 1 : 0).run();
            }

            return new Response(JSON.stringify({ success: true }), {
                headers: { "Content-Type": "application/json" }
            });
        } catch (err: any) {
            return new Response(JSON.stringify({ error: err.message || "Save Error" }), { status: 500 });
        }
    }

    return new Response("Method Not Allowed", { status: 405 });
}
