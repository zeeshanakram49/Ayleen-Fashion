import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ email: z.email() });

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  const raw = contentType.includes("application/json")
    ? await request.json()
    : Object.fromEntries(await request.formData());
  const parsed = schema.safeParse(raw);
  if (!parsed.success)
    return NextResponse.json(
      { message: "Enter a valid email address." },
      { status: 400 },
    );
  return NextResponse.json(
    {
      message:
        "Newsletter signup is pending backend configuration. Your address was not stored.",
    },
    { status: 202 },
  );
}
