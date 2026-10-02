import { put } from "@vercel/blob";
export async function POST(req) {
  const fd = await req.formData();
  if (fd.get("password") !== process.env.ADMIN_PASSWORD) return new Response("Wrong password", { status: 401 });
  const f = fd.get("file"), section = String(fd.get("section")).replace(/[^\w -]/g, "");
  if (!f || !f.type?.startsWith("image/")) return new Response("Images only", { status: 400 });
  const blob = await put(`work/${section}/${Date.now()}-${f.name}`, f, { access: "public" });
  return Response.json({ url: blob.url });
}
