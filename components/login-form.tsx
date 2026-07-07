"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import logo from "@/assets/images/logo.png";
import slackLogo from "@/assets/images/slack.png";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const clientId = process.env.NEXT_PUBLIC_SLACK_CLIENT_ID;
      const redirectUri = encodeURIComponent(
        `http://localhost:3000/api/slack/callback`,
      );

      // Put your exact bot scopes here! This fixes the error instantly.
      // Your actual bot operational permissions
      const botScopes =
        "channels:history,channels:read,chat:write,commands,groups:history,im:history,mpim:history,mpim:write,pins:read";
      // CRITICAL: Next-Gen CLI configurations require user sign-in contexts to pass openid scopes inside user_scope
      const userScopes = "openid,profile,email";

      window.location.href = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${botScopes}&user_scope=${userScopes}&redirect_uri=${redirectUri}`;
      // Update this route to redirect to an authenticated route. The user already has an active session.
      //router.push("/dashboard");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div>
        <Image
          src={logo}
          alt="Logo"
          width={80}
          height={80}
          className="mx-auto"
        />
        <div className="mt-4">
          <h3 className="text-2xl font-sans text-center font-semibold">
            Use Trace
          </h3>
          <p className="text-xs text-center text-black/50 mb-6">
            Trace is built on slack for slack users. So sign in with your slack
            account to get started.
          </p>
        </div>
        <div>
          <div className="flex flex-col gap-6">
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button
              type="button"
              onClick={() => handleLogin()}
              className="w-full"
              disabled={isLoading}
            >
              <Image src={slackLogo} alt="Slack Logo" width={20} height={20} />
              {isLoading ? "Connecting..." : "Sign in with Slack"}
            </Button>
          </div>
          <Link
            href="/privacy"
            className="flex justify-center text-sm font-mono text-center text-green-500 mt-4 duration-500 transition hover:text-green-600"
          >
            Terms of Service and Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
