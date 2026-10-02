import { list } from "@vercel/blob";
export const dynamic = "force-dynamic";
export async function GET(req) {
  const prefix = new URL(req.url).searchParams.get("prefix") || "";
  if (!/^(work|music)\//.test(prefix)) return new Response("Bad prefix", { status: 400 });
  try { return Response.json({ files: (await list({ prefix })).blobs.map(b => ({ pathname: b.pathname, url: b.url })) }); }
  catch { return Response.json({ files: [] }); }
}
