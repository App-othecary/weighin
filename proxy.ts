import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

/**
 * Refreshes the Supabase session before
 * the requested page is rendered.
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

/**
 * Exclude static assets and Next.js internal files.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
