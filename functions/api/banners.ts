export async function onRequest(context) {
    const { env, request } = context;
    const db = env.DB;

    if (request.method === "GET") {
        try {
            const { results } = await db.prepare("SELECT * FROM banners").all();
            return new Response(JSON.stringify(results), {
                headers: { "Content-Type": "application/json" }
            });
        } catch (err) {
            return new Response(JSON.stringify({ error: err.message }), { status: 500 });
        }
    }

    if (request.method === "POST") {
        try {
            const data = await request.json();
            const { title, subtitle, image, bg, active } = data;

            await db.prepare(`
        INSERT INTO banners (title, subtitle, image, bg, active)
        VALUES (?, ?, ?, ?, ?)
      `).bind(title, subtitle, image, bg, active ? 1 : 0).run();

            return new Response(JSON.stringify({ success: true }), {
                headers: { "Content-Type": "application/json" }
            });
        } catch (err) {
            return new Response(JSON.stringify({ error: err.message }), { status: 500 });
        }
    }

    return new Response("Method Not Allowed", { status: 405 });
}
