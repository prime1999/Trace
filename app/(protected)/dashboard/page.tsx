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
    <main className="w-full min-h-screen p-4 grid grid-cols-5 gap-4">
      <div className="col-span-1">
        <Sidebar />
      </div>
      <div className="w-full col-span-4">
        <Topbar />
        <div>
          <div className="w-full h-[calc(100vh-80px)] flex items-center justify-center bg-gray-200 rounded-lg">
            <h6>Welcome back User</h6>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
