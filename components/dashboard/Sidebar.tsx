"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo.png";
import slackImage from "@/assets/images/slack.png";
import {
  BookOpenText,
  ChartNoAxesCombined,
  Lightbulb,
  PanelsTopLeft,
  Settings,
} from "lucide-react";
import { signOutUser } from "@/lib/supabase/supabase.action";
import AllKnowledgeModal from "./AllKnowledgeModal";
import SuggestionsModal from "./SuggestionsModal";

const Sidebar = ({
  entries,
  suggestions,
}: {
  entries: any[];
  suggestions: any[];
}) => {
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(false);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
  return (
    <main className="relative h-full bg-gray-200 rounded-xl p-6">
      <Link href="/" className="flex items-center justify-center gap-2 mb-4">
        <Image src={logo} alt="Logo" width={32} height={32} />
        <h1 className="font-sans text-lg font-bold">Trace</h1>
      </Link>
      <div className="flex flex-col gap-6 text-sm mt-12">
        <h6 className="font-semibold text-gray-700 font-sans text-xs">Menu</h6>
        <button className="flex items-center gap-2 text-black/50 duration-500 transition hover:text-black/90">
          <PanelsTopLeft size={16} color="green" /> Overview
        </button>
        <button
          onClick={() => setShowKnowledgeModal(true)}
          className="flex items-center gap-2 text-black/50 duration-500 transition hover:text-black/90"
        >
          <BookOpenText size={16} color="green" /> Knowledge Base
        </button>
        <button
          onClick={() => setShowSuggestionsModal(true)}
          className="flex items-center gap-2 text-black/50 duration-500 transition hover:text-black/90"
        >
          <Lightbulb size={16} color="green" /> Suggestions
        </button>
        <button className="flex items-center gap-2 text-black/50 duration-500 transition hover:text-black/90">
          <ChartNoAxesCombined size={16} color="green" /> Analytics
        </button>
        <button className="flex items-center gap-2 text-black/50 duration-500 transition hover:text-black/90">
          <Settings size={16} color="green" /> Settings
        </button>
      </div>
      <div className="absolute bottom-5 left-0 right-0">
        <div className="w-10/12 mx-auto p-2 border bg-white mb-4 rounded-md">
          <div className="flex items-start gap-2">
            <Image src={slackImage} alt="Slack" width={24} height={24} />
            <div>
              {" "}
              <h6 className="font-sans font-semibold text-black">Trace</h6>
              <span className="text-xs text-green-800 font-semibold bg-green-200 p-1 rounded-md">
                Connected
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={signOutUser}
            className="text-xs text-purple-500 border border-purple-500 mt-4 py-2 w-full flex items-center justify-center rounded-md font-semibold duration-500 transition hover:text-purple-800 hover:border-purple-800"
          >
            Disconnect
          </button>
        </div>
        <p className="text-xs text-gray-500 text-center">
          © 2026 Trace. All rights reserved.
        </p>
      </div>

      <AllKnowledgeModal
        entries={entries}
        suggestions={suggestions}
        showKnowledgeModal={showKnowledgeModal}
        setShowKnowledgeModal={setShowKnowledgeModal}
      />
      <SuggestionsModal
        suggestions={suggestions}
        showSuggetsionsModal={showSuggestionsModal}
        setShowSuggetsionsModal={setShowSuggestionsModal}
      />
    </main>
  );
};

export default Sidebar;
