import { clearSessionCookie, json, rejectCrossOrigin, type FunctionContext } from '../_lib/auth';

export const onRequestPost = async (context: FunctionContext) => {
    const originError = rejectCrossOrigin(context);
    if (originError) return originError;
    return json({ authenticated: false }, { headers: { 'Set-Cookie': clearSessionCookie(context.request, 'user') } });
};
