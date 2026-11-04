import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AuthForm from "@/components/auth/AuthForm";

type LoginContentProps = {
  mode?: "login" | "register";
};

export default async function LoginContent({
  mode = "login",
}: LoginContentProps) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error) {
    console.error("Checking authentication failed:", error.message);
  }

  if (data?.claims) {
    redirect("/dashboard");
  }

  return <AuthForm mode={mode} />;
}
