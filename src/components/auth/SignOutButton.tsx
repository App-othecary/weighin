"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/clients";

/**
 * Signs out the current user and returns to login.
 */
export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign-out failed:", error.message);
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="rounded-md border border-[#d6ded4] px-3 py-2 text-sm font-medium text-[#344a36] hover:bg-[#f0f4ed]"
    >
      Sign out
    </button>
  );
}
