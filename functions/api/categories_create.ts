import { requireAdmin, rejectCrossOrigin, type FunctionContext } from '../_lib/auth';

export async function onRequest(context: FunctionContext) {
    if (context.request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
    const originError = rejectCrossOrigin(context);
    if (originError) return originError;
    const authError = await requireAdmin(context);
    if (authError) return authError;
    const { env, request } = context;
    const db = env.DB;

    try {
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                icon TEXT,
                image TEXT,
                count INTEGER DEFAULT 0,
                sort_order INTEGER DEFAULT 0
            )
        `).run();

        try {
            await db.prepare("ALTER TABLE categories ADD COLUMN sort_order INTEGER DEFAULT 0").run();
        } catch (e) { /* ignore if exists */ }

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
