"use client";

import { useState } from "react";
import type { KnowledgeSuggestionRow } from "@/lib/supabase/supabase.action";
// 1. Import your browser-safe Supabase client creator
// import { createClient } from "@/lib/supabase/client";

type SuggestionsProps = {
  initialSuggestions: KnowledgeSuggestionRow[];
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
      return "border-green-200/50 bg-green-50 text-green-700";
    case "rejected":
      return "border-red-200/50 bg-red-50 text-red-700";
    default:
      return "border-amber-200/50 bg-amber-50 text-amber-700";
  }
};

const Suggestions = ({ initialSuggestions }: SuggestionsProps) => {
  // Store suggestions in local state so the row status updates instantly when clicked
  const [suggestions, setSuggestions] = useState(initialSuggestions);

  // 2. The core workflow execution function
  const handleTriggerWorkflow = async (
    id: number,
    actionType: "approve" | "reject",
  ) => {
    try {
      // Initialize the Supabase browser client
      // const supabase = createClient();

      // OPTION A: If your workflow is an Edge Function
      /*
      await supabase.functions.invoke("your-workflow-function-name", {
        body: { suggestionId: id, action: actionType },
      });
      */

      // OPTION B: If your workflow is a PostgreSQL Stored Procedure / RPC
      /*
      await supabase.rpc("trigger_knowledge_workflow", {
        suggestion_id: id,
        action: actionType
      });
      */

      // Update local state so the badge color flips immediately
      setSuggestions((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: actionType === "approve" ? "approved" : "rejected",
              }
            : item,
        ),
      );

      console.log(`Fired ${actionType} workflow for suggestion: ${id}`);
    } catch (error) {
      console.error("Workflow trigger failed:", error);
    }
  };

  const recentSuggestions = [...suggestions]
    .sort((a, b) => {
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return timeB - timeA;
    })
    .slice(0, 5);

  return (
    <section className="mt-6 w-full rounded-xl border border-black/10 p-2 md:w-1/2">
      <div className="flex items-center justify-between border-b border-black/5 px-4 py-3">
        <div>
          <h2 className="font-sans text-lg font-semibold text-black">
            Suggestions
          </h2>
          <p className="text-sm text-black/50">
            Review the latest five knowledge suggestions.
          </p>
        </div>
        <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-black/70">
          {recentSuggestions.length} items
        </span>
      </div>

      <div className="w-full overflow-x-auto rounded-xl bg-white">
        <table className="w-full min-w-[720px] table-fixed text-left">
          <thead className="bg-black/5 text-xs uppercase tracking-wide text-black/50">
            <tr>
              <th className="w-[20%] px-4 py-3 font-medium">Title</th>
              <th className="w-[30%] px-4 py-3 font-medium">Summary</th>
              <th className="w-[15%] px-4 py-3 font-medium">Created</th>
              <th className="w-[20%] px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {recentSuggestions.length > 0 ? (
              recentSuggestions.map((suggestion) => (
                <tr
                  key={suggestion.id}
                  className="transition-colors hover:bg-black/[0.01]"
                >
                  <td className="px-4 py-3 text-sm font-medium text-black">
                    <p className="truncate" title={suggestion.title}>
                      {suggestion.title}
                    </p>
                    <p className="text-xs font-normal text-black/50">
                      {suggestion.knowledge_type}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-sm text-black/70">
                    <p
                      className="line-clamp-2 text-xs"
                      title={suggestion.summary}
                    >
                      {suggestion.summary ?? "No summary provided."}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-sm text-black/70 whitespace-nowrap">
                    {formatDate(suggestion.created_at)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleTriggerWorkflow(suggestion.id, "approve")
                        }
                        className="rounded-md bg-green-700 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-900"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleTriggerWorkflow(suggestion.id, "reject")
                        }
                        className="rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-100"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="px-4 py-8 text-center text-sm text-black/50"
                  colSpan={5}
                >
                  No suggestions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Suggestions;
