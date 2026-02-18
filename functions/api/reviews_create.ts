
export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        const { request, env } = context;
        const body = await request.json();
        const { user_id, user_name, car_model, comment, rating, gender } = body as any;

        if (!user_id || !comment) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { success } = await env.DB.prepare(
            `INSERT INTO reviews (user_id, user_name, car_model, comment, rating, gender) VALUES (?, ?, ?, ?, ?, ?)`
        )
            .bind(user_id, user_name, car_model, comment, rating, gender || 'male')
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
