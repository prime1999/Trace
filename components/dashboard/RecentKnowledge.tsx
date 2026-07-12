import type {
  KnowledgeEntryRow,
  KnowledgeSuggestionRow,
} from "@/lib/supabase/supabase.action";

type RecentKnowledgeProps = {
  suggestions: KnowledgeSuggestionRow[];
  entries: KnowledgeEntryRow[];
};

type RecentKnowledgeItem = {
  id: string;
  title: string;
  summary: string;
  kind: "Suggestion" | "Entry"; // Added kind type definition back
  status: string;
  createdAt: string | undefined;
};

const formatDate = (value?: string) => {
  if (!value) return "Recently";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

const getStatusStyles = (status: string) => {
  switch (status?.toLowerCase()) {
    case "approved":
    case "saved":
      return "border-green-200/50 bg-green-50 text-green-700";
    case "rejected":
      return "border-red-200/50 bg-red-50 text-red-700";
    default:
      return "border-amber-200/50 bg-amber-50 text-amber-700";
  }
};

const RecentKnowledge = ({ suggestions, entries }: RecentKnowledgeProps) => {
  // 1. Map entries and parse timestamps up front with the correct properties
  const mappedItems: RecentKnowledgeItem[] = [
    ...suggestions.map((s) => ({
      id: `suggestion-${s.id}`,
      title: s.title,
      summary: s.summary,
      kind: "Suggestion" as const, // Fixed missing kind mapping
      status: s.status,
      createdAt: s.created_at,
    })),
    ...entries.map((e) => ({
      id: `entry-${e.id}`,
      title: e.title,
      summary: e.summary ?? "No summary available",
      kind: "Entry" as const, // Fixed missing kind mapping
      status: e.status ?? "saved",
      createdAt: e.created_at,
    })),
  ];

  // 2. Sort and slice cleanly
  const recentItems = mappedItems
    .sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    })
    .slice(0, 5);

  return (
    <section className="mt-6 w-full rounded-xl border border-black/10 p-2 md:w-1/2">
      <div className="flex items-center justify-between border-b border-black/5 px-4 py-3">
        <div>
          <h2 className="font-sans text-lg font-semibold text-black">
            Recent knowledge
          </h2>
          <p className="text-sm text-black/50">
            Latest five suggestions and saved entries.
          </p>
        </div>
        <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-black/70">
          {recentItems.length} items
        </span>
      </div>

      {/* Changed overflow-x-hidden to overflow-x-auto so min-w-[720px] scrolls gracefully on small screens */}
      <div className="w-full overflow-x-auto bg-white rounded-xl">
        <table className="w-full min-w-[720px] text-left table-fixed">
          <thead className="bg-black/5 text-xs uppercase tracking-wide text-black/50">
            <tr>
              <th className="w-[15%] px-4 py-3 font-medium">Status</th>
              <th className="w-[45%] px-4 py-3 font-medium">Title & Summary</th>
              <th className="w-[15%] px-4 py-3 font-medium">Type</th>
              <th className="w-[25%] px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {recentItems.length > 0 ? (
              recentItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-black/[0.01] transition-colors"
                >
                  {/* Column 1: Status */}
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusStyles(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Column 2: Title & Summary Stack */}
                  <td className="px-4 py-3 text-sm font-medium text-black">
                    <p className="truncate" title={item.title}>
                      {item.title}
                    </p>
                    <p
                      className="text-xs font-normal text-black/50 truncate"
                      title={item.summary}
                    >
                      {item.summary}
                    </p>
                  </td>

                  {/* Column 3: Type */}
                  <td className="px-4 py-3 text-sm text-black/70 font-mono">
                    {item.kind}
                  </td>

                  {/* Column 4: Created Date */}
                  <td className="px-4 py-3 text-sm text-black/70 whitespace-nowrap">
                    {formatDate(item.createdAt)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="px-4 py-8 text-center text-sm text-black/50"
                  colSpan={4} // Reset colSpan to match our 4 columns
                >
                  No recent knowledge items yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button className="my-4 ml-2 block rounded-md bg-green-700 text-white px-4 py-2 text-sm font-sans font-medium cursor-pointer transition-colors duration-300 hover:bg-green-900">
        See All
      </button>
    </section>
  );
};

export default RecentKnowledge;
