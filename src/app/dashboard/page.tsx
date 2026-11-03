import { Suspense } from "react";
import DashboardContent from "./DashboardContent";

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7f9f6] p-8">
          <p className="text-sm text-[#687268]">Loading your dashboard...</p>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
