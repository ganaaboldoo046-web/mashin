export async function onRequest(context: any) {
    const { env } = context;
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

        const { results } = await db.prepare("SELECT * FROM categories").all();
        return new Response(JSON.stringify(results), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message || "DB Error" }), { status: 500 });
    }
}
