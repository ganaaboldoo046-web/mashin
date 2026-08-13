
import { errorMessage, json, readSession, rejectCrossOrigin, type FunctionContext } from '../_lib/auth';

export const onRequestPost = async (context: FunctionContext) => {
    const originError = rejectCrossOrigin(context);
    if (originError) return originError;
    const session = await readSession(context.request, context.env, 'user');
    if (!session) return json({ error: 'Sign in is required' }, { status: 401 });

    try {
        const { request, env } = context;
        const body = await request.json() as { car_model?: string; comment?: string; rating?: number; gender?: string };
        const carModel = body.car_model?.trim().slice(0, 100) || '';
        const comment = body.comment?.trim().slice(0, 1000) || '';
        const rating = Number(body.rating);
        const gender = body.gender === 'female' ? 'female' : 'male';

        if (!comment || !Number.isInteger(rating) || rating < 1 || rating > 5) return json({ error: 'Invalid review' }, { status: 400 });

        const { success } = await env.DB.prepare(
            `INSERT INTO reviews (user_id, user_name, car_model, comment, rating, gender) VALUES (?, ?, ?, ?, ?, ?)`
        )
            .bind(session.sub, session.name, carModel, comment, rating, gender)
            .run();

        if (success) {
            return json({ success: true });
        } else {
            throw new Error('Database insert failed');
        }
    } catch (error) {
        return json({ error: errorMessage(error) }, { status: 500 });
    }
};
