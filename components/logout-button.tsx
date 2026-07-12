import { Button } from "@/components/ui/button";
import { signOutUser } from "@/lib/supabase/supabase.action";

export function LogoutButton() {
  return (
    <form action={signOutUser}>
      <Button type="submit">Logout</Button>
    </form>
  );
}
