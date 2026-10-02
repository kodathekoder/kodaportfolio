import { del } from "@vercel/blob";
export async function POST(req) {
  const { url, password } = await req.json();
  if (password !== process.env.ADMIN_PASSWORD) return new Response("Wrong password", { status: 401 });
  await del(url);
  return Response.json({ ok: true });
}
