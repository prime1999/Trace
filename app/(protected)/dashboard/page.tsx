import { redirect } from "next/navigation";

import {
  getCurrentUserKnowledgeEntries,
  getCurrentUserKnowledgeSuggestions,
  getCurrentUserSlackConnection,
  getUserClaims,
} from "@/lib/supabase/supabase.action";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import { ScrollText, FileInput, StickyNote } from "lucide-react";

const DashboardPage = async () => {
  const user = await getUserClaims();

  if (!user) {
    redirect("/auth/login");
  }

  const connection = await getCurrentUserSlackConnection();
  const entries = await getCurrentUserKnowledgeEntries();
  const suggestions = await getCurrentUserKnowledgeSuggestions();
  console.log("entries", entries);

  return (
    <main className="w-full min-h-screen p-4 grid grid-cols-5 gap-4">
      <div className="col-span-1">
        <Sidebar />
      </div>
      <div className="w-full col-span-4">
        <Topbar workspaceName={connection?.team_name} />
        <div>
          <div className="w-full h-[calc(100vh-80px)] p-3 bg-gray-200 rounded-xl mt-4">
            <h6 className="font-sans font-semibold text-2xl">
              Welcome back User
            </h6>
            <p className="text-sm text-black/50">
              Here is what is happening on your knowledge base.
            </p>
            <div className="w-full mt-6 flex items-center gap-4">
              <div className="h-24 w-1/4 flex items-center gap-4 rounded-xl bg-gradient-to-b from-green-600 to-black p-2">
                <span className="flex items-center gap-2 bg-green-100 p-2 rounded-full font-sans font-semibold">
                  <ScrollText />
                </span>
                <span className="text-white font-sans">
                  {" "}
                  <h3 className="text-sm">Total knowledge saved</h3>
                  <p className="text-sm font-bold">
                    {entries &&
                      suggestions &&
                      entries.length + suggestions.length}{" "}
                  </p>
                </span>
              </div>
              {/* entries */}
              <div className="h-24 w-1/4 flex items-center gap-4 rounded-xl border bg-white shadow-sm p-2">
                <span className="flex items-center gap-2 bg-green-100 p-2 rounded-full font-sans font-semibold">
                  <FileInput />
                </span>
                <span className="font-sans">
                  {" "}
                  <h3 className="text-sm">Knowledge Entries</h3>
                  <p className="text-sm font-bold">
                    {entries && entries.length}{" "}
                  </p>
                </span>
              </div>
              {/* suggestions */}
              <div className="h-24 w-1/4 flex items-center gap-4 rounded-xl border bg-white shadow-sm p-2">
                <span className="flex items-center gap-2 bg-green-100 p-2 rounded-full font-sans font-semibold">
                  <StickyNote />
                </span>
                <span className="font-sans">
                  {" "}
                  <h3 className="text-sm">Knowledge Suggestions</h3>
                  <p className="text-sm font-bold">
                    {suggestions && suggestions.length}{" "}
                  </p>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
