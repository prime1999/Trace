// app/api/trace/route.ts

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { WebClient } from "@slack/web-api";

import { supabaseAdmin } from "@/lib/supabase/admin";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    /**
     * Verify request
     */
    const secret = req.headers.get("x-trace-secret");

    if (secret !== process.env.TRACE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { intent, command, teamId, channelId, messageTs, threadTs } =
      await req.json();

    /**
     * Find Slack connection
     */
    const { data: connection } = await supabaseAdmin
      .from("slack_connections")
      .select("*")
      .eq("team_id", teamId)
      .single();

    if (!connection) {
      return NextResponse.json(
        {
          error: "Workspace connection not found",
        },
        {
          status: 404,
        },
      );
    }

    const slack = new WebClient(connection.access_token);

    /**
     * Gather context
     */
    let context = "";

    if (threadTs) {
      const replies = await slack.conversations.replies({
        channel: channelId,
        ts: threadTs,
      });

      context =
        replies.messages
          ?.map((m) => `${m.user || "unknown"}: ${m.text || ""}`)
          .join("\n") || "";
    } else {
      const history = await slack.conversations.history({
        channel: channelId,
        latest: messageTs,
        inclusive: true,
        limit: 10,
      });

      context =
        history.messages
          ?.reverse()
          .map((m) => `${m.user || "unknown"}: ${m.text || ""}`)
          .join("\n") || "";
    }

    /**
     * FORCE SAVE
     */
    if (intent === "save") {
      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",

        contents: `
Analyze this Slack conversation.

Extract reusable knowledge.

Return JSON:

{
  "title": "",
  "summary": "",
  "knowledgeType": "",
  "confidence": 0
}

Conversation:

${context}
`,
      });

      const parsed = JSON.parse(result.text || "{}");

      const { data: suggestion } = await supabaseAdmin
        .from("knowledge_suggestions")
        .insert({
          slack_connection_id: connection.id,

          title: parsed.title,

          summary: parsed.summary,

          knowledge_type: parsed.knowledgeType,

          confidence: parsed.confidence,

          channel_id: channelId,

          thread_ts: threadTs || messageTs,

          status: "pending",
        })
        .select()
        .single();

      return NextResponse.json({
        type: "knowledge_saved",

        title: suggestion?.title,

        summary: suggestion?.summary,
      });
    }

    /**
     * TRACE INTENT
     */
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",

      contents: `
You are Trace.

Determine what the user wants.

Possible actions:

1. answer_question
2. analyze_conversation

User command:

${command}

Conversation:

${context}

Return JSON:

{
  "action": "",
  "message": ""
}
`,
    });

    const decision = JSON.parse(response.text || "{}");

    /**
     * Answer Question
     */
    if (decision.action === "answer_question") {
      return NextResponse.json({
        type: "answer",

        answer: decision.message,
      });
    }

    /**
     * Analyze Conversation
     */
    return NextResponse.json({
      type: "analysis_result",

      message: decision.message,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Trace processing failed",
      },
      {
        status: 500,
      },
    );
  }
}
