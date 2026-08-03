import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { accountSchema } from "@/lib/validation/schemas";
import { commerceConfig } from "@/lib/commerce/config";
import {
  asString,
  isRecord,
  proxyCommerce,
  recordFromResponse,
} from "@/lib/commerce/http";

function tokenFrom(value: unknown): string {
  const record = recordFromResponse(value);
  if (!record) return "";
  const nested = isRecord(record.data) ? record.data : null;
  return (
    asString(record.token) ||
    asString(record.access_token) ||
    (nested ? asString(nested.token) || asString(nested.access_token) : "")
  );
}

function userFrom(value: unknown): unknown {
  const record = recordFromResponse(value);
  if (!record) return null;
  return isRecord(record.user) ? record.user : record;
}

export async function GET() {
  const cookieStore = await cookies();
  const bearerToken = cookieStore.get("aylee_session")?.value;
  if (!bearerToken)
    return NextResponse.json({ authenticated: false, user: null });
  const result = await proxyCommerce(
    commerceConfig.endpoints.me,
    { method: "GET" },
    { bearerToken },
  );
  if (!result.ok) {
    const response = NextResponse.json(
      { authenticated: false, user: null },
      { status: result.status === 401 ? 401 : 503 },
    );
    if (result.status === 401) response.cookies.delete("aylee_session");
    return response;
  }
  return NextResponse.json({
    authenticated: true,
    user: userFrom(result.data),
  });
}

export async function POST(request: Request) {
  try {
    const input = accountSchema.parse(await request.json());
    const path =
      input.mode === "login"
        ? commerceConfig.endpoints.login
        : commerceConfig.endpoints.register;
    const formData = new FormData();
    formData.set("email", input.email);
    formData.set("password", input.password);
    if (input.mode === "register") formData.set("name", input.name || "");
    const result = await proxyCommerce(path, {
      method: "POST",
      body: formData,
    });
    if (!result.ok)
      return NextResponse.json(
        {
          message: isRecord(result.data)
            ? asString(result.data.message) || "Authentication failed."
            : "Authentication failed.",
        },
        { status: result.status },
      );
    const token = tokenFrom(result.data);
    if (!token)
      return NextResponse.json(
        { message: "The authentication service did not return a session." },
        { status: 502 },
      );
    const response = NextResponse.json({
      authenticated: true,
      user: userFrom(result.data),
    });
    response.cookies.set("aylee_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (error) {
    if (error instanceof ZodError)
      return NextResponse.json(
        {
          message: "Check your account details.",
          errors: error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    return NextResponse.json(
      { message: "Account service unavailable." },
      { status: 503 },
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  const bearerToken = cookieStore.get("aylee_session")?.value;
  if (bearerToken)
    await proxyCommerce(
      commerceConfig.endpoints.logout,
      { method: "POST" },
      { bearerToken },
    );
  const response = NextResponse.json({ authenticated: false });
  response.cookies.delete("aylee_session");
  return response;
}
