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
                count INTEGER DEFAULT 0
            )
        `).run();

        const { id } = await request.json();
        if (!id) {
            return new Response(JSON.stringify({ error: "ID required" }), { status: 400 });
        }

        await db.prepare("DELETE FROM categories WHERE id = ?").bind(id).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message || "Delete Error" }), { status: 500 });
    }
}
