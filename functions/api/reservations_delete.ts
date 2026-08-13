
import { errorMessage, json, requireAdmin, rejectCrossOrigin, type FunctionContext } from '../_lib/auth';

export const onRequestDelete = async (context: FunctionContext) => {
    const originError = rejectCrossOrigin(context);
    if (originError) return originError;
    const authError = await requireAdmin(context);
    if (authError) return authError;
    try {
        const { request, env } = context;
        const url = new URL(request.url);
        const id = Number(url.searchParams.get('id'));

        if (!Number.isInteger(id) || id <= 0) {
            return json({ error: 'Valid ID is required' }, { status: 400 });
        }

        const { success } = await env.DB.prepare(
            'DELETE FROM reservations WHERE id = ?'
        )
            .bind(id)
            .run();

        if (success) {
            return new Response(JSON.stringify({ success: true }), {
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            throw new Error('Database delete failed');
        }
    } catch (error) {
        return json({ error: errorMessage(error) }, { status: 500 });
    }
};
