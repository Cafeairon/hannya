import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Heart, MapPin, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { HannyaLogo } from "@/components/brand/HannyaLogo";
import { Peony } from "@/components/brand/Peony";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Hannya — Sua proteção começa aqui" },
      {
        name: "description",
        content:
          "Hannya é um ecossistema de segurança feminina urbana com dispositivo físico discreto e botão SOS independente.",
      },
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
    <div className="relative min-h-screen flex flex-col px-6 py-10 bg-background overflow-hidden">
      <Peony className="pointer-events-none absolute -top-10 -right-12 size-64 text-pink/25" />
      <Peony className="pointer-events-none absolute bottom-32 -left-16 size-56 text-pink/20" />

      <div className="relative flex-1 flex flex-col items-center justify-center text-center">
        <div className="size-28 rounded-[2rem] bg-primary shadow-lg overflow-hidden">
          <HannyaLogo className="size-full object-cover" />
        </div>
        <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-primary/80">
          Proteção · Força · Vigilância
        </p>
        <h1 className="mt-2 text-5xl font-semibold tracking-tight text-foreground">
          Hannya
        </h1>
        <p className="mt-4 text-base text-muted-foreground max-w-xs">
          Sua segurança sempre por perto. Conectamos você, seu dispositivo e quem te ama em segundos.
        </p>

        <ul className="mt-10 w-full max-w-xs space-y-3 text-left">
          <Feature icon={<KeyRound className="size-4" />} text="Botão SOS físico independente" />
          <Feature icon={<MapPin className="size-4" />} text="Rastreio em tempo real" />
          <Feature icon={<Heart className="size-4" />} text="Sua rede de confiança avisada na hora" />
        </ul>
      </div>

      <div className="relative space-y-3">
        <Link to="/auth" search={{ mode: "signup" }}>
          <Button size="lg" className="w-full h-14 text-base rounded-2xl">
            Criar minha conta
          </Button>
        </Link>
        <Link to="/auth" search={{ mode: "login" }}>
          <Button size="lg" variant="outline" className="w-full h-14 text-base rounded-2xl border-primary/30 text-foreground">
            Já tenho conta
          </Button>
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
    <li className="flex items-center gap-3 text-sm text-foreground">
      <span className="size-8 rounded-full bg-primary text-primary-foreground grid place-items-center">
        {icon}
      </span>
      {text}
    </li>
  );
}
