import { createSessionCookie, json, rejectCrossOrigin, type FunctionContext } from '../_lib/auth';

interface GoogleUserInfo {
    sub?: string;
    email?: string;
    email_verified?: boolean;
    name?: string;
    picture?: string;
}

export const onRequestPost = async (context: FunctionContext) => {
    const originError = rejectCrossOrigin(context);
    if (originError) return originError;
    if (!context.env.SESSION_SECRET) return json({ error: 'User authentication is not configured' }, { status: 503 });

    const body = await context.request.json().catch(() => null) as { accessToken?: string } | null;
    if (!body?.accessToken || body.accessToken.length > 4096) return json({ error: 'Google access token is required' }, { status: 400 });

    const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${body.accessToken}` },
    });
    if (!googleResponse.ok) return json({ error: 'Google authentication failed' }, { status: 401 });

    const googleUser = await googleResponse.json() as GoogleUserInfo;
    if (!googleUser.sub || !googleUser.email || googleUser.email_verified !== true) {
        return json({ error: 'A verified Google account is required' }, { status: 401 });
    }

    const user = {
        googleId: googleUser.sub,
        email: googleUser.email,
        name: googleUser.name?.trim() || googleUser.email.split('@')[0],
        avatar: googleUser.picture,
    };
    const cookie = await createSessionCookie(context.request, context.env, {
        kind: 'user',
        sub: user.googleId,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
    }, 60 * 60 * 24 * 7);

    return json({ authenticated: true, user }, { headers: { 'Set-Cookie': cookie } });
};
