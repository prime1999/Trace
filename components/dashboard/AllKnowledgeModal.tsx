"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, FileText, Lightbulb, Calendar } from "lucide-react";
import type {
  KnowledgeEntryRow,
  KnowledgeSuggestionRow,
} from "@/lib/supabase/supabase.action";

type AllKnowledgeModalProps = {
  suggestions: KnowledgeSuggestionRow[];
  entries: KnowledgeEntryRow[];
  showKnowledgeModal: boolean;
  setShowKnowledgeModal: (value: boolean) => void;
};

type CombinedItem = {
  id: string;
  title: string;
  summary: string;
  kind: "Entry" | "Suggestion";
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

export default function AllKnowledgeModal({
  suggestions,
  entries,
  showKnowledgeModal,
  setShowKnowledgeModal,
}: AllKnowledgeModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Combine and sort all items cleanly by timestamp
  const allItems = useMemo(() => {
    const combined: CombinedItem[] = [
      ...entries.map((e) => ({
        id: `entry-${e.id}`,
        title: e.title,
        summary: e.summary ?? "No summary available",
        kind: "Entry" as const,
        status: e.status ?? "saved",
        createdAt: e.created_at,
      })),
      ...suggestions.map((s) => ({
        id: `suggestion-${s.id}`,
        title: s.title,
        summary: s.summary,
        kind: "Suggestion" as const,
        status: s.status,
        createdAt: s.created_at,
      })),
    ];

    return combined.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
  }, [entries, suggestions]);

  // 2. Filter items dynamically based on search string
  const filteredItems = useMemo(() => {
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [allItems, searchQuery]);

  return (
    <Dialog open={showKnowledgeModal} onOpenChange={setShowKnowledgeModal}>
      {/* Trigger Button matches your original "See All" button layout */}

      <DialogContent className="sm:max-w-[640px] max-h-[85vh] flex flex-col p-6 bg-white border border-black/10 rounded-xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold font-sans text-black">
            All Knowledge Items
          </DialogTitle>
          <DialogDescription className="text-sm text-black/50">
            Search and explore all your current saved knowledge entries and
            crowd-sourced suggestions.
          </DialogDescription>
        </DialogHeader>

        {/* Search Bar section */}
        <div className="relative mt-4 mb-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
          <Input
            placeholder="Search by title or summary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 w-full text-sm border border-black/10 rounded-lg focus-visible:ring-green-700 focus-visible:border-green-700 bg-black/[0.01]"
          />
        </div>

        {/* Scrollable Container Window for items list */}
        <ScrollArea className="flex-1 mt-2 pr-2 overflow-y-auto">
          <div className="space-y-3">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border border-black/5 rounded-xl bg-black/[0.01] hover:bg-black/[0.02] transition-colors flex items-start gap-3"
                >
                  {/* Structural Type Icon Badge Indicator */}
                  <div
                    className={`p-2 rounded-lg mt-0.5 ${
                      item.kind === "Entry"
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {item.kind === "Entry" ? (
                      <FileText className="h-4 w-4" />
                    ) : (
                      <Lightbulb className="h-4 w-4" />
                    )}
                  </div>

                  {/* Main Data Column */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-black truncate max-w-[70%]">
                        {item.title}
                      </h4>
                      <span
                        className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          item.status.toLowerCase() === "approved" ||
                          item.status.toLowerCase() === "saved"
                            ? "bg-green-50/50 text-green-700 border-green-200/30"
                            : "bg-amber-50/50 text-amber-700 border-amber-200/30"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-black/60 line-clamp-2 leading-relaxed mb-2">
                      {item.summary}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-black/40 font-medium">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(item.createdAt)}</span>
                      <span className="mx-1">•</span>
                      <span className="font-mono">{item.kind}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-sm text-black/40 font-medium">
                No records matching your search queries found.
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
