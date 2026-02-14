export async function onRequest(context: any) {
    const { env, request } = context;
    const db = env.DB;

    if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const { ids } = await request.json();
        if (!Array.isArray(ids)) {
            return new Response(JSON.stringify({ error: "IDs array required" }), { status: 400 });
        }

        // Perform batch update of sort_order
        // We use a simple loop with individual updates for D1
        const statements = ids.map((id, index) =>
            db.prepare("UPDATE categories SET sort_order = ? WHERE id = ?").bind(index, id)
        );

        await db.batch(statements);

        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message || "Reorder Error" }), { status: 500 });
    }
}
