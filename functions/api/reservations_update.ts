
interface Env {
    DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        const { request, env } = context;
        const body = await request.json() as { id: number, status: string };

        if (!body.id || !body.status) {
            return new Response(JSON.stringify({ error: 'ID and Status are required' }), { status: 400 });
        }

        const { success } = await env.DB.prepare(
            'UPDATE reservations SET status = ?, status_updated_at = strftime("%s", "now") WHERE id = ?'
        )
            .bind(body.status, body.id)
            .run();

        if (success) {
            return new Response(JSON.stringify({ success: true }), {
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            throw new Error('Update failed');
        }
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
