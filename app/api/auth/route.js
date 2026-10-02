export async function POST(req) {
  const { password } = await req.json();
  const ok = !!process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD;
  return ok ? Response.json({ ok: true }) : new Response("Wrong password", { status: 401 });
}
