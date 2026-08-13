
import { errorMessage, json, readSession, type FunctionContext } from '../_lib/auth';

export const onRequestGet = async (context: FunctionContext) => {
    const { request, env } = context;
    const adminSession = await readSession(request, env, 'admin');
    const userSession = await readSession(request, env, 'user');
    if (!adminSession && !userSession) return json({ error: 'Authentication required' }, { status: 401 });

    try {
        if (userSession && !adminSession) {
            const query = `
                SELECT r.*, p.images as product_images, p.name as product_name
                FROM reservations r
                LEFT JOIN products p ON r.product_id = p.id
                WHERE r.user_id = ?
                ORDER BY r.created_at DESC
            `;
            const results = await env.DB.prepare(query).bind(userSession.sub).all();
            return json(results.results);
        }

        const query = `
                SELECT r.*, p.images as product_images, p.name as product_name
                FROM reservations r
                LEFT JOIN products p ON r.product_id = p.id
                ORDER BY r.created_at DESC
            `;
        const results = await env.DB.prepare(query).all();
        return json(results.results);
    } catch (error) {
        return json({ error: errorMessage(error) }, { status: 500 });
    }
};
