export async function onRequest(context) {
    const { env } = context;
    const db = env.DB;

    try {
        const { results } = await db.prepare("SELECT * FROM products ORDER BY created_at DESC").all();
        return new Response(JSON.stringify(results), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
