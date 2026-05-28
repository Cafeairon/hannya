import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  component: IndexRedirect,
});

function IndexRedirect() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    navigate({ to: session ? "/app" : "/welcome", replace: true });
  }, [loading, session, navigate]);
  return (
    <div className="min-h-screen grid place-items-center">
      <Loader2 className="size-6 animate-spin text-primary" />
    </div>
  );
}
