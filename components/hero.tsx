import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import dashboard from "@/assets/images/slackDashboard.png";
import slackMobile from "@/assets/images/slackMobile.png";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden px-6 py-16 sm:px-10">
      <div className="pointer-events-none absolute inset-0 mesh opacity-70" />
      <div className="relative flex flex-col items-center">
        <span className="font-mono text-xs border rounded-full px-4 py-1 bg-white/70">
          ✨ AI-Powered Knowledge Capture for Slack
        </span>
        <h1 className="text-3xl lg:text-6xl mt-8 !leading-tight mx-auto max-w-3xl text-center font-semibold">
          Stop Losing Important Knowledge in Slack
        </h1>
        <p className="text-center text-sm max-w-3xl mt-4 text-black/70">
          Trace is a privacy-first organizational memory agent that helps teams
          intentionally capture decisions, processes, lessons, and insights from
          conversations, turning Slack into a living memory rather than a stream
          of messages.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/auth/login"
            className="flex items-center gap-2 rounded-full bg-black/90 px-5 py-2.5 font-mono text-sm text-white transition duration-500 hover:bg-black/80"
          >
            <span>Get Started</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="#docs"
            className="flex items-center rounded-full border bg-white/60 px-5 py-2.5 text-sm font-semibold transition duration-500 hover:bg-white/90"
          >
            See Documentation
          </Link>
        </div>

        <p className="text-xs italic text-center mt-4 text-black/50 max-w-3xl">
          Built for teams that want fewer repeated questions and faster
          onboarding.
        </p>
        <div className="hidden md:block mt-8 w-full max-w-5xl rounded-lg overflow-hidden border p-2 bg-white/70">
          <Image src={dashboard} alt="Slack Dashboard" className="rounded-lg" />
        </div>
        <div className="md:hidden mt-8 w-full max-w-5xl rounded-lg overflow-hidden">
          <Image src={slackMobile} alt="Slack Mobile" className="rounded-lg" />
        </div>
      </div>
    </section>
  );
}
