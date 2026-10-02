import crypto from "crypto";
import { cookies } from "next/headers";
export const sig = () => crypto.createHmac("sha256", process.env.ADMIN_PASSWORD || "x").update("admin").digest("hex");
export function isAdmin() {
  if (!process.env.ADMIN_PASSWORD) return false;
  const c = cookies().get("admin")?.value, s = sig();
  return !!c && c.length === s.length && crypto.timingSafeEqual(Buffer.from(c), Buffer.from(s));
}
// Token for your PRIVATE Blob store (see README)
export const privToken = () => process.env.PRIVATE_BLOB_READ_WRITE_TOKEN || process.env.PRIVATE_READ_WRITE_TOKEN;
