import { redirect } from "next/navigation";

/**
 * Redirects the root URL to the main dashboard.
 *
 * Authentication will later determine whether the
 * visitor can access the dashboard.
 */
export default function HomePage() {
  redirect("/dashboard");
}
