import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

function isSafeRelativePath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//") && !path.includes("\\");
}

export async function GET(request: Request) {
  (await draftMode()).disable();
  const { searchParams } = new URL(request.url);
  const redirectTo = searchParams.get("redirect") ?? "/";
  const safeRedirect = isSafeRelativePath(redirectTo) ? redirectTo : "/";
  return NextResponse.redirect(new URL(safeRedirect, request.url));
}
