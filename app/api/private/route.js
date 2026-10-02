import { put, list, get, del } from "@vercel/blob";
import { isAdmin, privToken } from "../../../lib/auth";
export const dynamic = "force-dynamic";
const no = () => new Response("Not logged in", { status: 401 });
const err = e => new Response("Private store error: " + e.message, { status: 500 });
export async function GET(req) {
  if (!isAdmin()) return no();
  const p = new URL(req.url).searchParams.get("p");
  try {
    const token = privToken();
    if (!p) return Response.json({ files: (await list({ prefix: "private/", token })).blobs.map(b => ({ pathname: b.pathname, url: b.url })) });
    if (!p.startsWith("private/")) return new Response("Bad path", { status: 400 });
    const r = await get(p, { access: "private", token });
    if (!r?.stream) return new Response("Not found", { status: 404 });
    return new Response(r.stream, { headers: { "Content-Type": r.blob.contentType, "Cache-Control": "private, no-store" } });
  } catch (e) { return err(e); }
}
export async function POST(req) {
  if (!isAdmin()) return no();
  const f = (await req.formData()).get("file");
  if (!f?.type?.startsWith("image/")) return new Response("Images only", { status: 400 });
  try { await put(`private/${Date.now()}-${f.name}`, f, { access: "private", token: privToken() }); return Response.json({ ok: true }); } catch (e) { return err(e); }
}
export async function DELETE(req) {
  if (!isAdmin()) return no();
  const { url } = await req.json();
  try { await del(url, { token: privToken() }); return Response.json({ ok: true }); } catch (e) { return err(e); }
}
