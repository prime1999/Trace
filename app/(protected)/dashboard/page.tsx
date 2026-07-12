import { redirect } from "next/navigation";

import { getUserClaims } from "@/lib/supabase/supabase.action";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

const DashboardPage = async () => {
  const user = await getUserClaims();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <main className="min-h-screen p-4 grid grid-cols-5 gap-4">
      <div className="cols-span-1">
        <Sidebar />
      </div>
      <div className="cols-span-4">
        <Topbar />
        <div>Body</div>
      </div>
    </main>
  );
};

export default DashboardPage;
