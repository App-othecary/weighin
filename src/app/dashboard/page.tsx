// import { Suspense } from "react";
// import DashboardContent from "./DashboardContent";

// export default function DashboardPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="min-h-screen bg-[#f7f9f6] p-8">
//           <p className="text-sm text-[#687268]">Loading your dashboard...</p>
//         </div>
//       }
//     >
//       <DashboardContent />
//     </Suspense>
//   );
// }

import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";

async function SupabaseTest() {
  await createClient();

  return (
    <main className="min-h-screen bg-[#f7f9f6] p-8">
      <h1 className="text-xl font-semibold text-[#344a36]">
        Supabase client created successfully.
      </h1>
      <p className="mt-2 text-sm text-[#687268]">
        No authentication check or database query was performed.
      </p>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<p>Testing Supabase...</p>}>
      <SupabaseTest />
    </Suspense>
  );
}
