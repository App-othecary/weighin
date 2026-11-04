import { Suspense } from "react";
import LoginContent from "./LoginContent";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f7f9f6]">
          <p className="text-sm text-[#687268]">Loading login...</p>
        </main>
      }
    >
      <LoginContent mode="login" />
    </Suspense>
  );
}
