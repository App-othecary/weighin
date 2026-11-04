import { Suspense } from "react";
import LoginContent from "../login/LoginContent";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f7f9f6]">
          <p className="text-sm text-[#687268]">Loading registration...</p>
        </main>
      }
    >
      <LoginContent mode="register" />
    </Suspense>
  );
}
