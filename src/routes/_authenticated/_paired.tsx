import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/_paired")({
  component: PairedGuard,
});

function PairedGuard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("devices").select("id").eq("user_id", user.id).limit(1).then(({ data }) => {
      if (!data || data.length === 0) navigate({ to: "/onboarding", replace: true });
      else setOk(true);
    });
  }, [user, navigate]);

  if (!ok) {
    return <div className="min-h-screen grid place-items-center"><Loader2 className="size-6 animate-spin text-primary" /></div>;
  }
  return <Outlet />;
}
