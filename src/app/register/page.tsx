import { redirect } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import { createClient } from "@/lib/supabase/server";

/**
 * Registration page.
 * Already-authenticated users go to the dashboard.
 */
export default async function RegisterPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (data?.claims) {
    redirect("/dashboard");
  }

  return <AuthForm mode="register" />;
}
