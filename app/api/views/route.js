import { put, get } from "@vercel/blob";
import { privToken } from "../../../lib/auth";
import { config } from "../../../lib/config";
export const dynamic = "force-dynamic";
const P = "meta/views.json";
async function read(token) {
  const r = await get(P, { access: "private", token, useCache: false });
  if (!r?.stream) return config.views; // first time: start from config.views
  return JSON.parse(await new Response(r.stream).text()).views ?? config.views;
}
export async function GET() {
  try { return Response.json({ views: await read(privToken()) }); } catch { return Response.json({ views: config.views }); }
}
export async function POST() {
  try {
    const token = privToken(), views = (await read(token)) + 1;
    await put(P, JSON.stringify({ views }), { access: "private", token, allowOverwrite: true, addRandomSuffix: false, contentType: "application/json" });
    return Response.json({ views });
  } catch { return Response.json({ views: config.views }); }
}
