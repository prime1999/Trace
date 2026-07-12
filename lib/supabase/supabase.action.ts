"use server";

import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type SlackConnectionRow = {
  id: number;
  user_id: string;
  access_token: string;
  scopes: string | null;
  team_id: string;
  team_name: string;
  bot_user_id: string;
  updated_at: string;
};

export type KnowledgeSuggestionRow = {
  id: string;
  slack_connection_id: number;
  title: string;
  summary: string;
  knowledge_type: string;
  confidence: number;
  channel_id: string;
  thread_ts: string | null;
  status: string;
  created_at?: string;
  updated_at?: string;
};

export type KnowledgeEntryRow = {
  id: number;
  slack_connection_id: number;
  title: string;
  summary: string | null;
  knowledge_type: string | null;
  source: string | null;
  channel_id: string | null;
  thread_ts: string | null;
  status: string | null;
  created_at?: string;
  updated_at?: string;
};

async function getCurrentUserId() {
  const claims = await getUserClaims();

  if (!claims) {
    return null;
  }

  const typedClaims = claims as { sub?: string; id?: string };

  return typedClaims.sub ?? typedClaims.id ?? null;
}

export async function getUserClaims() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    return null;
  }

  return data.claims;
}

export async function getCurrentUserSlackConnection() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("slack_connections")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle<SlackConnectionRow>();

  if (error) {
    console.error("Error loading Slack connection:", error);
    return null;
  }

  return data;
}

export async function getCurrentUserKnowledgeSuggestions() {
  const connection = await getCurrentUserSlackConnection();

  if (!connection) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("knowledge_suggestions")
    .select("*")
    .eq("slack_connection_id", connection.id)
    .order("created_at", { ascending: false })
    .returns<KnowledgeSuggestionRow[]>();

  if (error) {
    console.error("Error loading knowledge suggestions:", error);
    return [];
  }

  return data ?? [];
}

export async function getCurrentUserKnowledgeEntries() {
  const connection = await getCurrentUserSlackConnection();

  if (!connection) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("knowledge_entries")
    .select("*")
    .eq("slack_connection_id", connection.id)
    .order("created_at", { ascending: false })
    .returns<KnowledgeEntryRow[]>();

  if (error) {
    console.error("Error loading knowledge entries:", error);
    return [];
  }

  return data ?? [];
}

export async function approveKnowledgeSuggestion(suggestionId: string) {
  const supabase = await createClient();

  const { data: suggestion, error: suggestionError } = await supabase
    .from("knowledge_suggestions")
    .select("*")
    .eq("id", suggestionId)
    .single();

  if (suggestionError) {
    throw suggestionError;
  }

  const { error: entryError } = await supabase
    .from("knowledge_entries")
    .insert({
      slack_connection_id: suggestion.slack_connection_id,
      title: suggestion.title,
      summary: suggestion.summary,
      knowledge_type: suggestion.knowledge_type,
      channel_id: suggestion.channel_id,
      thread_ts: suggestion.thread_ts,
    });

  if (entryError) {
    throw entryError;
  }

  const { error: deleteError } = await supabase
    .from("knowledge_suggestions")
    .delete()
    .eq("id", suggestionId);

  if (deleteError) {
    throw deleteError;
  }

  return { success: true };
}
export async function rejectKnowledgeSuggestion(suggestionId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("knowledge_suggestions")
    .delete()
    .eq("id", suggestionId);

  if (error) {
    throw error;
  }

  return {
    success: true,
  };
}
////////////////////////////////////////////////
export async function signOutUser() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}

export async function verifyOtpToken(tokenHash: string, type: EmailOtpType) {
  const supabase = await createClient();

  return supabase.auth.verifyOtp({
    type,
    token_hash: tokenHash,
  });
}

export type SlackConnectionInput = {
  email: string;
  password: string;
  botToken: string;
  scopes: string | null;
  teamId: string;
  teamName: string;
  userSlackId: string;
};

export async function syncSlackConnection({
  email,
  password,
  botToken,
  scopes,
  teamId,
  teamName,
  userSlackId,
}: SlackConnectionInput) {
  const supabase = await createClient();

  let userId: string | null = null;

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    if (signUpError.message.includes("already registered")) {
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        return { error: signInError, userId: null };
      }

      userId = signInData.user?.id ?? null;
    } else {
      return { error: signUpError, userId: null };
    }
  } else {
    userId = signUpData.user?.id ?? null;
  }

  if (!userId) {
    return { error: new Error("Unable to resolve Supabase user id"), userId };
  }

  const { error: dbError } = await supabase.from("slack_connections").upsert(
    {
      user_id: userId,
      access_token: botToken,
      scopes,
      team_id: teamId,
      team_name: teamName,
      bot_user_id: userSlackId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,team_id" },
  );

  if (dbError) {
    return { error: dbError, userId };
  }

  return { error: null, userId };
}
