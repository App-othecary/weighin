"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/clients";

type AuthFormProps = {
  mode: "login" | "register";
};

/**
 * Handles email/password registration and login.
 */
export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isRegistering = mode === "register";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsLoading(true);

    const supabase = createClient();

    try {
      if (isRegistering) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          throw error;
        }

        if (!data.session) {
          setMessage(
            "Registration successful. Check your email to confirm your account.",
          );
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          throw error;
        }
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f9f6] px-5 py-10">
      <section className="w-full max-w-md rounded-xl border border-[#e3e9e1] bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-[#202820]">
          {isRegistering ? "Create your account" : "Sign in to WeighIN"}
        </h1>

        <p className="mt-2 text-sm text-[#687268]">
          {isRegistering
            ? "Register with your email address."
            : "Enter your account details to continue."}
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#303a30]"
            >
              Email address
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-md border border-[#d6ded4] px-3 py-2.5 text-sm outline-none focus:border-[#657d62] focus:ring-2 focus:ring-[#657d62]/15"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#303a30]"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete={isRegistering ? "new-password" : "current-password"}
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border border-[#d6ded4] px-3 py-2.5 text-sm outline-none focus:border-[#657d62] focus:ring-2 focus:ring-[#657d62]/15"
              placeholder="At least 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-[#344a36] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#263a29] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading
              ? "Please wait..."
              : isRegistering
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        {message && (
          <p
            role="status"
            className="mt-5 rounded-md bg-[#f0f4ed] p-3 text-sm text-[#344a36]"
          >
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-[#687268]">
          {isRegistering ? "Already registered?" : "New to WeighIN?"}{" "}
          <a
            href={isRegistering ? "/login" : "/register"}
            className="font-medium text-[#344a36] underline underline-offset-4"
          >
            {isRegistering ? "Sign in" : "Create an account"}
          </a>
        </p>
      </section>
    </main>
  );
}
