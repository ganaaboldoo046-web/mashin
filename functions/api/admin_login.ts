import { createSessionCookie, json, rejectCrossOrigin, secureHashEqual, type FunctionContext } from '../_lib/auth';

export const onRequestPost = async (context: FunctionContext) => {
    const originError = rejectCrossOrigin(context);
    if (originError) return originError;

    const { ADMIN_EMAIL, ADMIN_PASSWORD_HASH, SESSION_SECRET } = context.env;
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH || !SESSION_SECRET) {
        return json({ error: 'Admin authentication is not configured' }, { status: 503 });
    }

    const body = await context.request.json().catch(() => null) as { email?: string; password?: string } | null;
    const emailMatches = body?.email?.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase();
    const passwordMatches = body?.password ? await secureHashEqual(body.password, ADMIN_PASSWORD_HASH) : false;
    if (!emailMatches || !passwordMatches) return json({ error: 'Invalid email or password' }, { status: 401 });

    const cookie = await createSessionCookie(context.request, context.env, {
        kind: 'admin',
        sub: ADMIN_EMAIL,
        email: ADMIN_EMAIL,
        name: 'Administrator',
    }, 60 * 60 * 8);

    return json({ authenticated: true }, { headers: { 'Set-Cookie': cookie } });
};
