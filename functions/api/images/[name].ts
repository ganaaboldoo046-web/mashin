export async function onRequest(context) {
    const { env, params } = context;
    const bucket = env.BUCKET;
    const name = params.name;

    if (!name) {
        return new Response("Missing image name", { status: 400 });
    }

    try {
        const object = await bucket.get(name);

        if (object === null) {
            return new Response("Image Not Found", { status: 404 });
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set("etag", object.httpEtag);
        headers.set("Cache-Control", "public, max-age=31536000, immutable");

        return new Response(object.body, {
            headers
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
