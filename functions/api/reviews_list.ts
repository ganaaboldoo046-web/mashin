
export const onRequestGet: PagesFunction<Env> = async (context) => {
    try {
        const { env } = context;
        const { results } = await env.DB.prepare(
            'SELECT * FROM reviews ORDER BY created_at DESC'
        ).all();

        return new Response(JSON.stringify(results), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
