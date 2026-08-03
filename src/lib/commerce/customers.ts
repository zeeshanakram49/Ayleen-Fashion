import "server-only";

import { cookies } from "next/headers";
import { proxyCommerce } from "./http";

export async function getSessionToken(): Promise<string | undefined> {
  return (await cookies()).get("aylee_session")?.value;
}

export async function authenticatedCommerce(
  path: string,
  init: RequestInit = {},
) {
  const bearerToken = await getSessionToken();
  if (!bearerToken)
    return { ok: false, status: 401, data: { message: "Sign in required" } };
  return proxyCommerce(path, init, { bearerToken });
}
