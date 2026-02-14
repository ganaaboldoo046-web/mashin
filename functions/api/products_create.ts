export async function onRequest(context) {
    const { env, request } = context;
    const db = env.DB;

    if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const data = await request.json();
        const { name, price, priceKRW, year, mileage, fuel, description, categoryId, status, images, isFeatured } = data;

        await db.prepare(`
      INSERT INTO products (name, price, priceKRW, year, mileage, fuel, description, categoryId, status, images, isFeatured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(name, price, priceKRW, year, mileage, fuel, description, categoryId, status, JSON.stringify(images), isFeatured ? 1 : 0).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
