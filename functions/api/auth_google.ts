import { createSessionCookie, json, rejectCrossOrigin, type FunctionContext } from '../_lib/auth';

interface GoogleIdTokenPayload {
    iss?: string;
    aud?: string | string[];
    sub?: string;
    email?: string;
    email_verified?: boolean;
    name?: string;
    picture?: string;
    exp?: number;
    nbf?: number;
}

interface GoogleJwk extends JsonWebKey {
    kid?: string;
    alg?: string;
    use?: string;
}

let cachedKeys: GoogleJwk[] = [];
let cachedKeysExpireAt = 0;

const decodeBase64Url = (value: string) => {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const binary = atob(padded);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

const getGoogleKeys = async () => {
    if (cachedKeys.length > 0 && cachedKeysExpireAt > Date.now()) return cachedKeys;

    const response = await fetch('https://www.googleapis.com/oauth2/v3/certs');
    if (!response.ok) throw new Error('Unable to load Google signing keys');

    const body = await response.json() as { keys?: GoogleJwk[] };
    if (!Array.isArray(body.keys) || body.keys.length === 0) throw new Error('Google signing keys are unavailable');

    const maxAge = Number(response.headers.get('Cache-Control')?.match(/max-age=(\d+)/)?.[1] || 300);
    cachedKeys = body.keys;
    cachedKeysExpireAt = Date.now() + Math.max(60, maxAge) * 1000;
    return cachedKeys;
};

const verifyGoogleCredential = async (credential: string, clientId: string) => {
    const parts = credential.split('.');
    if (parts.length !== 3) return null;

    try {
        const header = JSON.parse(new TextDecoder().decode(decodeBase64Url(parts[0]))) as { alg?: string; kid?: string };
        const payload = JSON.parse(new TextDecoder().decode(decodeBase64Url(parts[1]))) as GoogleIdTokenPayload;
        if (header.alg !== 'RS256' || !header.kid) return null;

        const signingKey = (await getGoogleKeys()).find((key) => key.kid === header.kid && key.kty === 'RSA');
        if (!signingKey) return null;

        const cryptoKey = await crypto.subtle.importKey(
            'jwk',
            signingKey,
            { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
            false,
            ['verify'],
        );
        const signatureValid = await crypto.subtle.verify(
            'RSASSA-PKCS1-v1_5',
            cryptoKey,
            decodeBase64Url(parts[2]),
            new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
        );
        if (!signatureValid) return null;

        const now = Math.floor(Date.now() / 1000);
        const audienceValid = Array.isArray(payload.aud) ? payload.aud.includes(clientId) : payload.aud === clientId;
        const issuerValid = payload.iss === 'accounts.google.com' || payload.iss === 'https://accounts.google.com';
        if (!audienceValid || !issuerValid || !payload.exp || payload.exp <= now || (payload.nbf && payload.nbf > now + 60)) return null;
        if (!payload.sub || !payload.email || payload.email_verified !== true) return null;
        return payload;
    } catch {
        return null;
    }
};

export const onRequestPost = async (context: FunctionContext) => {
    const originError = rejectCrossOrigin(context);
    if (originError) return originError;
    if (!context.env.SESSION_SECRET) return json({ error: 'User authentication is not configured' }, { status: 503 });
    if (!context.env.GOOGLE_CLIENT_ID) return json({ error: 'Google authentication is not configured' }, { status: 503 });

    const body = await context.request.json().catch(() => null) as { credential?: string } | null;
    if (!body?.credential || body.credential.length > 8192) return json({ error: 'Google credential is required' }, { status: 400 });

    const googleUser = await verifyGoogleCredential(body.credential, context.env.GOOGLE_CLIENT_ID);
    if (!googleUser) return json({ error: 'Google authentication failed' }, { status: 401 });

    const user = {
        googleId: googleUser.sub!,
        email: googleUser.email!,
        name: googleUser.name?.trim() || googleUser.email!.split('@')[0],
        avatar: googleUser.picture,
    };

    await context.env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS oauth_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            provider TEXT NOT NULL,
            provider_sub TEXT NOT NULL,
            email TEXT NOT NULL,
            name TEXT,
            avatar TEXT,
            created_at INTEGER DEFAULT (strftime('%s', 'now')),
            last_login_at INTEGER DEFAULT (strftime('%s', 'now')),
            UNIQUE(provider, provider_sub)
        )
    `).run();
    await context.env.DB.prepare(`
        INSERT INTO oauth_users (provider, provider_sub, email, name, avatar)
        VALUES ('google', ?, ?, ?, ?)
        ON CONFLICT(provider, provider_sub) DO UPDATE SET
            email = excluded.email,
            name = excluded.name,
            avatar = excluded.avatar,
            last_login_at = strftime('%s', 'now')
    `).bind(user.googleId, user.email, user.name, user.avatar || null).run();

    const cookie = await createSessionCookie(context.request, context.env, {
        kind: 'user',
        sub: user.googleId,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
    }, 60 * 60 * 24 * 7);

    return json({ authenticated: true, user }, { headers: { 'Set-Cookie': cookie } });
};
