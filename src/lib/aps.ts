// Minimal APS OAuth helper for server-side usage only
// Reads credentials from environment variables

export type ApsScope =
  | "data:read"
  | "data:write"
  | "bucket:read"
  | "bucket:create"
  | "bucket:update"
  | "bucket:delete";

export interface ApsToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

const APS_AUTH_URL = "https://developer.api.autodesk.com/authentication/v2/token";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export async function getApsToken(scopes: ApsScope[]): Promise<ApsToken> {
  const clientId = getEnv("APS_CLIENT_ID");
  const clientSecret = getEnv("APS_CLIENT_SECRET");
  const scope = scopes.join(" ");

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    scope,
    client_id: clientId,
    client_secret: clientSecret,
  });

  const res = await fetch(APS_AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    // Next.js: ensure this runs only on server
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`APS token request failed: ${res.status} ${res.statusText} ${text}`);
  }

  return (await res.json()) as ApsToken;
}

export function buildApsAuthHeader(token: ApsToken): Record<string, string> {
  return { Authorization: `${token.token_type} ${token.access_token}` };
}


