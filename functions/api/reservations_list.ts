
interface Env {
    DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId'); // If provided, filter by user. If not, return all (admin)

    try {
        let query;
        let results;

        if (userId) {
            query = `
                SELECT r.*, p.images as product_images, p.name as product_name
                FROM reservations r
                LEFT JOIN products p ON r.product_id = p.id
                WHERE r.user_id = ?
                ORDER BY r.created_at DESC
            `;
            const stmt = env.DB.prepare(query).bind(userId);
            results = await stmt.all();
        } else {
            query = `
                SELECT r.*, p.images as product_images, p.name as product_name
                FROM reservations r
                LEFT JOIN products p ON r.product_id = p.id
                ORDER BY r.created_at DESC
            `;
            const stmt = env.DB.prepare(query);
            results = await stmt.all();
        }

        return new Response(JSON.stringify(results.results), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
