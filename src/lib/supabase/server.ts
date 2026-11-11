import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseKey } from "@/lib/supabase/config";

/**
 * Creates a Supabase client for server-side code.
 * The cookie store allows Supabase to access the
 * current user's session.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    getSupabaseKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components cannot always write cookies.
            // Session refresh will be handled by the
            // Next.js Proxy when we implement authentication.
          }
        },
      },
    },
  );
}
