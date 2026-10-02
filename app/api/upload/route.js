import { handleUpload } from "@vercel/blob/client";
import { isAdmin } from "../../../lib/auth";
export async function POST(req) {
  const body = await req.json();
  try {
    return Response.json(await handleUpload({
      body, request: req,
      onBeforeGenerateToken: async () => { if (!isAdmin()) throw new Error("Not logged in"); return { allowedContentTypes: ["image/*", "audio/*"] }; },
      onUploadCompleted: async () => {},
    }));
  } catch (e) { return new Response(e.message, { status: 400 }); }
}
