export async function onRequest(context: any) {
    const { env, request } = context;
    const db = env.DB;

    if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const { id } = await request.json();
        if (!id) {
            return new Response(JSON.stringify({ error: "ID required" }), { status: 400 });
        }

        await db.prepare("DELETE FROM banners WHERE id = ?").bind(id).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
