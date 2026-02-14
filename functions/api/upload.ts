export async function onRequest(context) {
    const { env, request } = context;
    const bucket = env.BUCKET;

    if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

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

        const fileName = `${crypto.randomUUID()}.webp`;
        await bucket.put(fileName, file.stream(), {
            httpMetadata: { contentType: "image/webp" }
        });

        return new Response(JSON.stringify({ url: `/api/images/${fileName}` }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
