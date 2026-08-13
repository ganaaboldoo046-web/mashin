export interface AppEnv {
    DB: {
        prepare(query: string): {
            bind(...values: unknown[]): ReturnType<AppEnv['DB']['prepare']>;
            first<T = Record<string, unknown>>(): Promise<T | null>;
            all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
            run(): Promise<{ success: boolean; meta?: { changes?: number } }>;
        };
        batch(statements: unknown[]): Promise<unknown>;
    };
    BUCKET?: {
        put(key: string, value: ReadableStream, options?: unknown): Promise<unknown>;
        get(key: string): Promise<{ body: ReadableStream; httpMetadata?: { contentType?: string } } | null>;
    };
    ADMIN_EMAIL?: string;
    ADMIN_PASSWORD_HASH?: string;
    SESSION_SECRET?: string;
    PUBLIC_SITE_URL?: string;
}

export interface FunctionContext {
    request: Request;
    env: AppEnv;
}

export interface SessionPayload {
    kind: 'admin' | 'user';
    sub: string;
    email: string;
    name: string;
    avatar?: string;
    exp: number;
}

const ADMIN_COOKIE = 'dt_admin_session';
const USER_COOKIE = 'dt_user_session';
const encoder = new TextEncoder();

const base64UrlEncode = (bytes: Uint8Array) => {
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const base64UrlDecode = (value: string) => {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const binary = atob(padded);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

const sign = async (value: string, secret: string) => {
    const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    return base64UrlEncode(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(value))));
};

const safeEqual = (left: string, right: string) => {
    if (left.length !== right.length) return false;
    let difference = 0;
    for (let index = 0; index < left.length; index += 1) {
        difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
    }
    return difference === 0;
};

const readCookie = (request: Request, name: string) => {
    const cookieHeader = request.headers.get('Cookie') || '';
    for (const entry of cookieHeader.split(';')) {
        const [key, ...parts] = entry.trim().split('=');
        if (key === name) return parts.join('=');
    }
    return null;
};

export const json = (body: unknown, init: ResponseInit = {}) => {
    const headers = new Headers(init.headers);
    headers.set('Content-Type', 'application/json; charset=utf-8');
    headers.set('Cache-Control', 'no-store');
    headers.set('X-Content-Type-Options', 'nosniff');
    return new Response(JSON.stringify(body), { ...init, headers });
};

export const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'Unexpected error';

export const isSameOrigin = (request: Request, env: AppEnv) => {
    const origin = request.headers.get('Origin');
    if (!origin) return true;
    const requestOrigin = new URL(request.url).origin;
    const configuredOrigin = env.PUBLIC_SITE_URL ? new URL(env.PUBLIC_SITE_URL).origin : null;
    return origin === requestOrigin || origin === configuredOrigin;
};

export const rejectCrossOrigin = (context: FunctionContext) =>
    isSameOrigin(context.request, context.env) ? null : json({ error: 'Cross-origin request rejected' }, { status: 403 });

export const createSessionCookie = async (
    request: Request,
    env: AppEnv,
    payload: Omit<SessionPayload, 'exp'>,
    maxAgeSeconds: number,
) => {
    if (!env.SESSION_SECRET || env.SESSION_SECRET.length < 32) throw new Error('SESSION_SECRET must be at least 32 characters');
    const completePayload: SessionPayload = { ...payload, exp: Math.floor(Date.now() / 1000) + maxAgeSeconds };
    const encodedPayload = base64UrlEncode(encoder.encode(JSON.stringify(completePayload)));
    const signature = await sign(encodedPayload, env.SESSION_SECRET);
    const cookieName = payload.kind === 'admin' ? ADMIN_COOKIE : USER_COOKIE;
    const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
    return `${cookieName}=${encodedPayload}.${signature}; HttpOnly${secure}; SameSite=Strict; Path=/; Max-Age=${maxAgeSeconds}`;
};

export const clearSessionCookie = (request: Request, kind: SessionPayload['kind']) => {
    const cookieName = kind === 'admin' ? ADMIN_COOKIE : USER_COOKIE;
    const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
    return `${cookieName}=; HttpOnly${secure}; SameSite=Strict; Path=/; Max-Age=0`;
};

export const readSession = async (request: Request, env: AppEnv, kind: SessionPayload['kind']) => {
    if (!env.SESSION_SECRET) return null;
    const cookieName = kind === 'admin' ? ADMIN_COOKIE : USER_COOKIE;
    const token = readCookie(request, cookieName);
    if (!token) return null;
    const [encodedPayload, suppliedSignature] = token.split('.');
    if (!encodedPayload || !suppliedSignature) return null;
    const expectedSignature = await sign(encodedPayload, env.SESSION_SECRET);
    if (!safeEqual(suppliedSignature, expectedSignature)) return null;

    try {
        const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(encodedPayload))) as SessionPayload;
        if (payload.kind !== kind || payload.exp <= Math.floor(Date.now() / 1000)) return null;
        return payload;
    } catch {
        return null;
    }
};

export const requireAdmin = async (context: FunctionContext) => {
    const session = await readSession(context.request, context.env, 'admin');
    return session ? null : json({ error: 'Authentication required' }, { status: 401 });
};

export const sha256Hex = async (value: string) => {
    const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value)));
    return [...digest].map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

export const secureHashEqual = async (value: string, expectedHash: string) => safeEqual(await sha256Hex(value), expectedHash.toLowerCase());
