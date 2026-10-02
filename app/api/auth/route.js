import { cookies } from "next/headers";
import { isAdmin, sig } from "../../../lib/auth";
export async function GET() { return Response.json({ admin: isAdmin() }); }
export async function POST(req) {
  const { password } = await req.json();
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) return new Response("Wrong password", { status: 401 });
  cookies().set("admin", sig(), { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 604800 });
  return Response.json({ ok: true });
}
export async function DELETE() { cookies().delete("admin"); return Response.json({ ok: true }); }
