import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) return NextResponse.redirect(`${origin}/?error=no_code`);

  try {
    // 1. Exchange code for tokens
    const response = await fetch("https://slack.com/api/oauth.v2.access", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_SLACK_CLIENT_ID!,
        client_secret: process.env.SLACK_CLIENT_SECRET!,
        code,
        redirect_uri: `${origin}/api/slack/callback`,
      }),
    });

    // 1. (Keep your existing fetch that calls oauth.v2.access)
    const data = await response.json();
    if (!data.ok)
      return NextResponse.redirect(`${origin}/?error=${data.error}`);

    const botToken = data.access_token;

    // 2. FORCE-FETCH WORKSPACE DETAILS DIRECTLY FROM SLACK
    console.log("Calling auth.test to force retrieve workspace IDs...");
    const testResponse = await fetch("https://slack.com/api/auth.test", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${botToken}`,
        "Content-Type": "application/json",
      },
    });

    const testData = await testResponse.json();
    console.log("Ground Truth Slack Data:", testData);

    if (!testData.ok) {
      console.error("❌ Slack auth.test failed:", testData.error);
      return NextResponse.redirect(`${origin}/?error=slack_validation_failed`);
    }

    // 3. MAP THESE CODES TO YOUR DATABASE VARIABLES (Guaranteed to exist now!)
    const teamId = testData.team_id;
    const teamName = testData.team || "Slack Workspace";
    const userSlackId = testData.user_id;
    const activeScopes = data.scope || null;

    // 4. (Keep your existing Supabase auth and table row insertion below)
    const emailPlaceholder = `slack.${userSlackId.toLowerCase()}@gmail.com`;
    const passwordPlaceholder = `slack-pass-${userSlackId}`;

    const supabase = await createClient();
    let userId: string | null = null;

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email: emailPlaceholder,
        password: passwordPlaceholder,
      },
    );

    if (signUpError && signUpError.message.includes("already registered")) {
      const { data: signInData } = await supabase.auth.signInWithPassword({
        email: emailPlaceholder,
        password: passwordPlaceholder,
      });
      userId = signInData.user?.id || null;
    } else {
      userId = signUpData.user?.id || null;
    }

    if (userId) {
      const { error: dbError } = await supabase
        .from("slack_connections")
        .upsert(
          {
            user_id: userId,
            access_token: botToken,
            scopes: activeScopes,
            team_id: teamId,
            team_name: teamName,
            bot_user_id: userSlackId,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,team_id" },
        );

      if (dbError) {
        console.error(
          "❌ Slack Connections insertion failed:",
          dbError.message,
        );
      } else {
        console.log(
          "✅ Row inserted into public.slack_connections flawlessly!",
        );
      }
    }

    return NextResponse.redirect(`${origin}/dashboard`);
  } catch (error) {
    console.error("❌ Server Core Crash:", error);
    return NextResponse.redirect(`${origin}/?error=server_error`);
  }
}
