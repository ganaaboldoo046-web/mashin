interface Env {
    DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        const { request, env } = context;
        const body = await request.json() as {
            productId: number;
            productName: string;
            userName: string;
            phone: string;
            facebookId: string;
            userId?: string;
        };

        if (!body.userName || !body.phone) {
            return new Response(JSON.stringify({ error: 'Name and Phone are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { success } = await env.DB.prepare(
            'INSERT INTO reservations (product_id, product_name, user_name, phone, facebook_id, user_id) VALUES (?, ?, ?, ?, ?, ?)'
        )
            .bind(body.productId, body.productName, body.userName, body.phone, body.facebookId || '', body.userId || null)
            .run();

        if (success) {
            return new Response(JSON.stringify({ success: true }), {
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            throw new Error('Database insert failed');
        }
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
