import { json, readSession, type FunctionContext } from '../_lib/auth';

export const onRequestGet = async (context: FunctionContext) => {
    const session = await readSession(context.request, context.env, 'admin');
    if (!session) return json({ authenticated: false }, { status: 401 });
    return json({ authenticated: true, user: { email: session.email, name: session.name } });
};
