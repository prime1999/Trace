import Link from "next/link";
import { Button } from "./ui/button";
import { getUserClaims } from "@/lib/supabase/supabase.action";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const user = await getUserClaims();

  return user ? (
    <div className="flex items-center gap-4">
      <Link href="/dashboard">Dashboard</Link>
      <LogoutButton />
    </div>
  ) : (
    <Button asChild size="sm" variant={"default"} className="rounded-full">
      <Link href="/auth/login">Get Trace</Link>
    </Button>
  );
}
