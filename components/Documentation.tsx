"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useMemo, useState } from "react";

const Documentation = () => {
  const faqData = [
    // =========================
    // INTEGRATIONS
    // =========================
    {
      category: "integration",
      question: "How does Trace connect to Slack?",
      answer:
        "Trace connects directly to your Slack workspace through the Slack App installation process. Once installed, it can access conversations and threads based on the permissions granted by workspace administrators.",
    },
    {
      category: "integration",
      question: "Does Trace automatically save every conversation?",
      answer:
        "No. Team members can explicitly save knowledge using #trace save, and Trace may also suggest valuable conversations for review. Nothing becomes part of the shared knowledge base without approval.",
    },
    {
      category: "integration",
      question: "What permissions does Trace require?",
      answer:
        "Trace requires access to Slack conversations, threads, and messages necessary to identify, review, and retrieve organizational knowledge. Permissions are requested during installation and can be reviewed by workspace administrators.",
    },
    {
      category: "integration",
      question: "Can Trace work in private channels?",
      answer:
        "Trace can only access channels it has been invited to and granted permission to access. Private channel visibility remains under the control of workspace administrators and channel members.",
    },
    {
      category: "integration",
      question: "How do I save knowledge manually?",
      answer:
        "Use the #trace save command within a conversation or thread. Trace will analyze the discussion and create a knowledge entry that can be reviewed and approved.",
    },
    {
      category: "integration",
      question: "Can I remove knowledge that was previously saved?",
      answer:
        "Yes. Approved knowledge entries can be edited, archived, or removed by authorized team members and knowledge managers.",
    },

    // =========================
    // KNOWLEDGE MANAGERS
    // =========================
    {
      category: "knowledge-manager",
      question: "What is a Knowledge Manager in Trace?",
      answer:
        "Knowledge Managers are responsible for reviewing, approving, organizing, and maintaining the quality of knowledge stored within Trace.",
    },
    {
      category: "knowledge-manager",
      question: "How does the approval workflow work?",
      answer:
        "When Trace identifies a potentially valuable conversation, it creates a suggested knowledge entry. Knowledge Managers can review the summary, context, and source conversation before approving or rejecting it.",
    },
    {
      category: "knowledge-manager",
      question: "What happens after a knowledge entry is approved?",
      answer:
        "Approved knowledge becomes searchable across the workspace and can be referenced by team members when looking for decisions, solutions, or historical context.",
    },
    {
      category: "knowledge-manager",
      question: "Can approved knowledge be edited?",
      answer:
        "Yes. Knowledge Managers can update summaries, categories, tags, and descriptions to improve accuracy and discoverability.",
    },
    {
      category: "knowledge-manager",
      question: "How does Trace determine what knowledge to suggest?",
      answer:
        "Trace analyzes conversations for signals such as decisions, problem resolutions, processes, lessons learned, and other valuable organizational context. Suggested entries are always reviewed before becoming part of the knowledge base.",
    },
    {
      category: "knowledge-manager",
      question: "How does Trace help with onboarding?",
      answer:
        "By preserving approved decisions, processes, and solutions, new team members can quickly access organizational knowledge without relying on tribal knowledge or searching through old Slack threads.",
    },
  ];

  const [activeCategory, setActiveCategory] = useState<"all" | string>("all");

  const filteredFaqData = useMemo(() => {
    if (activeCategory === "all") {
      return faqData;
    }

    return faqData.filter((faq) => faq.category === activeCategory);
  }, [activeCategory]);

  return (
    <main
      className="max-lg:w-11/12 flex flex-col lg:flex-row justify-center items-start gap-8 my-16"
      id="docs"
    >
      <div>
        <h1 className="font-sans text-5xl font-bold mb-8">Documentation</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 text-xs border rounded-lg transition-colors ${
              activeCategory === "all"
                ? "bg-blue-500 text-white border-blue-800"
                : "bg-white/60 text-black/80 hover:bg-white/40"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("integration")}
            className={`px-4 py-2 text-xs border rounded-lg transition-colors ${
              activeCategory === "integration"
                ? "bg-blue-500 text-white border-blue-800"
                : "bg-white/60 text-black/80 hover:bg-white/40"
            }`}
          >
            Integration
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory("knowledge-manager")}
            className={`px-4 py-2 text-xs border rounded-lg transition-colors ${
              activeCategory === "knowledge-manager"
                ? "bg-blue-500 text-white border-blue-800"
                : "bg-white/60 text-black/80 hover:bg-white/40"
            }`}
          >
            Knowledge Managers
          </button>
        </div>
      </div>
      <div className="mx-auto w-full max-w-xl">
        <Accordion
          key={activeCategory}
          type="single"
          collapsible
          defaultValue={filteredFaqData[0]?.question}
          className="w-full"
        >
          {filteredFaqData.map((faq: any) => (
            <AccordionItem
              className="w-full"
              value={faq.question}
              key={faq.question}
            >
              <AccordionTrigger className="w-full border rounded-md text-black/80 p-2 mt-4 hover:text-black/90">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="border rounded-md p-2 mt-2 text-xs text-black/60">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </main>
  );
};

export default Documentation;
