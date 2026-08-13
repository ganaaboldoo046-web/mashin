import { errorMessage, json, requireAdmin, rejectCrossOrigin, type FunctionContext } from '../_lib/auth';

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function onRequest(context: FunctionContext) {
    const { env, request } = context;
    const bucket = env.BUCKET;

    if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }
    const originError = rejectCrossOrigin(context);
    if (originError) return originError;
    const authError = await requireAdmin(context);
    if (authError) return authError;

    try {
        const contentType = request.headers.get("Content-Type");
        if (!contentType || !contentType.includes("multipart/form-data")) {
            return new Response("Unsupported Media Type", { status: 415 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new Response("Missing file", { status: 400 });
        }
        if (!ALLOWED_IMAGE_TYPES.has(file.type) || file.size <= 0 || file.size > MAX_UPLOAD_BYTES) {
            return json({ error: 'Only JPEG, PNG or WebP images up to 8 MB are allowed' }, { status: 400 });
        }
        if (!bucket) return json({ error: 'Image storage is not configured' }, { status: 503 });

        const extension = file.type === 'image/png' ? 'png' : file.type === 'image/jpeg' ? 'jpg' : 'webp';
        const fileName = `${crypto.randomUUID()}.${extension}`;
        await bucket.put(fileName, file.stream(), {
            httpMetadata: { contentType: file.type }
        });

        return new Response(JSON.stringify({ url: `/api/images/${fileName}` }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return json({ error: errorMessage(error) }, { status: 500 });
    }
}
