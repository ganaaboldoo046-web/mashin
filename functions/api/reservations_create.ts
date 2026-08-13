import { errorMessage, json, readSession, rejectCrossOrigin, type FunctionContext } from '../_lib/auth';

export const onRequestPost = async (context: FunctionContext) => {
    const originError = rejectCrossOrigin(context);
    if (originError) return originError;
    try {
        const { request, env } = context;
        const body = await request.json() as {
            productId: number;
            productName: string;
            userName: string;
            phone: string;
            facebookId: string;
        };
        const session = await readSession(request, env, 'user');
        const productId = Number(body.productId);
        const userName = body.userName?.trim().slice(0, 80);
        const phone = body.phone?.replace(/[^0-9+]/g, '').slice(0, 20);
        const facebookId = body.facebookId?.trim().slice(0, 200) || '';

        if (!Number.isInteger(productId) || productId <= 0 || !userName || !phone || phone.length < 8) {
            return json({ error: 'Valid product, name and phone are required' }, { status: 400 });
        }

        const product = await env.DB.prepare('SELECT name FROM products WHERE id = ?').bind(productId).first<{ name?: string }>();
        if (!product?.name) return json({ error: 'Product not found' }, { status: 404 });

        const { success } = await env.DB.prepare(
            'INSERT INTO reservations (product_id, product_name, user_name, phone, facebook_id, user_id) VALUES (?, ?, ?, ?, ?, ?)'
        )
            .bind(productId, product.name, userName, phone, facebookId, session?.sub || null)
            .run();

        if (success) {
            return json({ success: true }, { status: 201 });
        } else {
            throw new Error('Database insert failed');
        }
    } catch (error) {
        return json({ error: errorMessage(error) }, { status: 500 });
    }
};
