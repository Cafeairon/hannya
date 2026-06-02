import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useDevice } from "@/lib/storage";

export const Route = createFileRoute("/_authenticated/_paired")({
  component: PairedGuard,
});

function PairedGuard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ok, setOk] = useState<boolean | null>(null);
  const [, setLocalDevice] = useDevice();

  useEffect(() => {
    if (!user) return;
    supabase
      .from("devices")
      .select("tracking_code, battery, status")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) {
          navigate({ to: "/onboarding", replace: true });
          return;
        }
        setLocalDevice((d) => ({
          ...d,
          trackingCode: data.tracking_code,
          status: "connected",
          battery: d.battery || data.battery || 80,
          sosBattery: d.sosBattery || 95,
          solarCharging: true,
          lastSync: d.lastSync ?? Date.now(),
          components: { tracker: true, sos: true },
        }));
        setOk(true);
      });
  }, [user, navigate, setLocalDevice]);

  if (!ok) {
    return <div className="min-h-screen grid place-items-center"><Loader2 className="size-6 animate-spin text-primary" /></div>;
  }
  return <Outlet />;
}
