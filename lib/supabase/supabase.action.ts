"use server";

import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function getUserClaims() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    return null;
  }

  return data.claims;
}

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
