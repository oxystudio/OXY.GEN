// OXYGEN AI proxy for Cloudflare Workers (forwards only to Zhipu z.ai and OpenRouter)
const MAP = { zai: "https://api.z.ai", or: "https://openrouter.ai" };
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Max-Age": "86400"
};
export default {
  async fetch(req) {
    if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
    const u = new URL(req.url);
    const [, key, ...rest] = u.pathname.split("/");
    const base = MAP[key];
    if (!base) return new Response("OXYGEN AI proxy OK", { headers: CORS });
    const headers = new Headers(req.headers);
    headers.delete("origin");
    headers.delete("referer");
    const r = await fetch(base + "/" + rest.join("/") + u.search, {
      method: req.method,
      headers,
      body: req.method === "GET" ? undefined : req.body
    });
    const out = new Headers(r.headers);
    for (const [k, v] of Object.entries(CORS)) out.set(k, v);
    return new Response(r.body, { status: r.status, headers: out });
  }
};
