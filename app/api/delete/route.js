import { del } from "@vercel/blob";
import { isAdmin } from "../../../lib/auth";
export async function POST(req) {
  if (!isAdmin()) return new Response("Not logged in", { status: 401 });
  const { url } = await req.json();
  try { await del(url); return Response.json({ ok: true }); } catch (e) { return new Response(e.message, { status: 500 }); }
}
