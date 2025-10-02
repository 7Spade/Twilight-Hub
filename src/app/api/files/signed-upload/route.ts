import { NextRequest } from "next/server";
import { getApsToken, buildApsAuthHeader } from "@/lib/aps";

// Minimal signed upload proxy: creates storage and returns signed resource for client direct upload
// Expects JSON body: { projectId: string, folderUrn?: string, fileName: string, fileSize?: number, contentType?: string }

const APS_DM_BASE = "https://developer.api.autodesk.com";

export async function POST(req: NextRequest) {
  try {
    const { projectId, fileName } = await req.json();
    if (!projectId || !fileName) {
      return new Response("Missing projectId or fileName", { status: 400 });
    }

    const token = await getApsToken(["data:read", "data:write"]);
    const headers = {
      "Content-Type": "application/json",
      ...buildApsAuthHeader(token),
    } as Record<string, string>;

    // 1) Request signed S3 upload (APS Data v2 Signed Resources)
    // Docs indicate using POST projects/:project_id/storage then PUT signedresources/:id
    // Here we directly ask for a signed upload URL for generic OSS object via DM v2 helper endpoint
    const createSignedRes = await fetch(
      `${APS_DM_BASE}/oss/v2/signedresources`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          projectId,
          filename: fileName,
          // Additional attributes like contentLength or contentType can be added if needed by policy
        }),
        cache: "no-store",
      }
    );

    if (!createSignedRes.ok) {
      const errText = await createSignedRes.text().catch(() => "");
      return new Response(`Failed to create signed upload: ${errText}`.trim(), { status: 502 });
    }

    const signed = await createSignedRes.json();
    return Response.json(signed, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(message, { status: 500 });
  }
}


