import { NextRequest } from "next/server";
import { getApsToken, buildApsAuthHeader } from "@/lib/aps";

const APS_DM_BASE = "https://developer.api.autodesk.com";

// Expects JSON body: { objectUrn: string }
export async function POST(req: NextRequest) {
  try {
    const { objectUrn } = await req.json();
    if (!objectUrn) {
      return new Response("Missing objectUrn", { status: 400 });
    }

    const token = await getApsToken(["data:read"]);
    const headers = {
      "Content-Type": "application/json",
      ...buildApsAuthHeader(token),
    } as Record<string, string>;

    // Request a signed S3 download for the provided URN
    const res = await fetch(
      `${APS_DM_BASE}/oss/v2/signedresources/${encodeURIComponent(objectUrn)}/downloads`,
      {
        method: "GET",
        headers,
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return new Response(`Failed to create signed download: ${errText}`.trim(), { status: 502 });
    }

    const data = await res.json();
    return Response.json(data, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(message, { status: 500 });
  }
}


