export async function onRequest(context) {
    const { env, request } = context;
    const db = env.DB;

    if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const data = await request.json();
        const { name, icon, image } = data;

        await db.prepare(`
      INSERT INTO categories (name, icon, image)
      VALUES (?, ?, ?)
    `).bind(name, icon, image).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
