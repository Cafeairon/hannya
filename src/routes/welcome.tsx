import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ShieldAlert, Heart, MapPin, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "SafeHer — Sua proteção começa aqui" },
      { name: "description", content: "App de segurança feminina urbana integrado a um dispositivo físico discreto." },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && session) navigate({ to: "/app", replace: true });
  }, [loading, session, navigate]);

  return (
    <div className="min-h-screen flex flex-col px-6 py-10 bg-gradient-to-b from-primary/10 via-background to-background">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="size-24 rounded-[2rem] bg-primary/15 grid place-items-center shadow-sm">
          <ShieldAlert className="size-12 text-primary" aria-hidden />
        </div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight">SafeHer</h1>
        <p className="mt-3 text-base text-muted-foreground max-w-xs">
          Sua proteção sempre por perto. Conectamos você, seu dispositivo e quem te ama em segundos.
        </p>

        <ul className="mt-8 w-full max-w-xs space-y-3 text-left">
          <Feature icon={<KeyRound className="size-4" />} text="Botão SOS físico independente" />
          <Feature icon={<MapPin className="size-4" />} text="Rastreio em tempo real" />
          <Feature icon={<Heart className="size-4" />} text="Sua rede de confiança avisada na hora" />
        </ul>
      </div>

      <div className="space-y-3">
        <Link to="/auth" search={{ mode: "signup" }}>
          <Button size="lg" className="w-full h-14 text-base rounded-2xl">Criar minha conta</Button>
        </Link>
        <Link to="/auth" search={{ mode: "login" }}>
          <Button size="lg" variant="outline" className="w-full h-14 text-base rounded-2xl">Já tenho conta</Button>
        </Link>
        <p className="text-[11px] text-muted-foreground text-center pt-2">
          Ao continuar você concorda com nossos termos de uso e política de privacidade.
        </p>
      </div>
    </div>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-center gap-3 text-sm">
      <span className="size-8 rounded-full bg-primary/10 text-primary grid place-items-center">{icon}</span>
      {text}
    </li>
  );
}
