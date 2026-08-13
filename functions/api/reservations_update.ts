
import { errorMessage, json, requireAdmin, rejectCrossOrigin, type FunctionContext } from '../_lib/auth';

export const onRequestPost = async (context: FunctionContext) => {
    const originError = rejectCrossOrigin(context);
    if (originError) return originError;
    const authError = await requireAdmin(context);
    if (authError) return authError;
    try {
        const { request, env } = context;
        const body = await request.json() as { id: number, status: string };
        const allowedStatuses = new Set(['pending', 'confirmed', 'completed', 'cancelled']);

        if (!Number.isInteger(body.id) || !allowedStatuses.has(body.status)) {
            return json({ error: 'Valid ID and status are required' }, { status: 400 });
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
    } catch (error) {
        return json({ error: errorMessage(error) }, { status: 500 });
    }
};
