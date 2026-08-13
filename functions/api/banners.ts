import { requireAdmin, rejectCrossOrigin, type FunctionContext } from '../_lib/auth';

export async function onRequest(context: FunctionContext) {
    const { env, request } = context;
    const db = env.DB;

    // Ensure table exists for all methods (GET, POST, etc)
    try {
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
    } catch (e: any) {
        console.error("Table creation failed:", e);
    }

    if (request.method === "GET") {
        try {
            const { results } = await db.prepare("SELECT * FROM banners ORDER BY id ASC").all();
            return new Response(JSON.stringify(results || []), {
                headers: { "Content-Type": "application/json" }
            });
        } catch (err: any) {
            return new Response(JSON.stringify({ error: err.message || "DB Error" }), { status: 500 });
        }
    }

    if (request.method === "POST") {
        const originError = rejectCrossOrigin(context);
        if (originError) return originError;
        const authError = await requireAdmin(context);
        if (authError) return authError;
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
