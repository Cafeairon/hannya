import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useContacts, useSettings } from "@/lib/storage";
import { Phone, MapPin, MessageCircle, ShieldAlert, EyeOff } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/sos")({
  head: () => ({ meta: [{ title: "SOS — SafeHer" }] }),
  component: SosPage,
});

const POLICE_NUMBER = "190";
const SOS_MESSAGE = "Estou em situação de risco. Minha localização atual é esta.";

function SosPage() {
  const [contacts] = useContacts();
  const [settings, setSettings] = useSettings();
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const startHold = () => {
    setHolding(true);
    startRef.current = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - startRef.current) / 1500);
      setProgress(p);
      if (p >= 1) {
        trigger();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const cancelHold = () => {
    if (active) return;
    setHolding(false);
    setProgress(0);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  const trigger = () => {
    setActive(true);
    setHolding(false);
    setProgress(1);
    // Em produção: chamada real, push e geo. Aqui apenas simulação.
    if (!settings.silentMode) {
      toast.success("SOS acionado — polícia e contatos notificados");
    }
    // Aciona ligação para a polícia
    try {
      window.location.href = `tel:${POLICE_NUMBER}`;
    } catch {
      /* ignore */
    }
  };

  const cancelSos = () => {
    setActive(false);
    setProgress(0);
    toast("SOS cancelado");
  };

  const silent = settings.silentMode;

  return (
    <AppShell
      title={active ? "SOS ativo" : "Emergência"}
      subtitle={
        active
          ? "Sua localização está sendo compartilhada em tempo real."
          : "Segure o botão por 1,5s para acionar ajuda."
      }
    >
      <Card
        className={`p-6 rounded-3xl border-border/60 ${
          silent ? "bg-zinc-900 text-zinc-50" : ""
        }`}
      >
        <div className="flex items-center justify-between">
          <p className={`text-xs ${silent ? "text-zinc-400" : "text-muted-foreground"}`}>
            Modo silencioso
          </p>
          <button
            onClick={() => setSettings({ ...settings, silentMode: !silent })}
            className={`inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full ${
              silent ? "bg-zinc-700 text-zinc-100" : "bg-secondary text-secondary-foreground"
            }`}
            aria-pressed={silent}
          >
            <EyeOff className="size-3.5" /> {silent ? "Ativo" : "Desligado"}
          </button>
        </div>

        <div className="mt-6 grid place-items-center">
          <button
            onPointerDown={startHold}
            onPointerUp={cancelHold}
            onPointerLeave={cancelHold}
            onPointerCancel={cancelHold}
            disabled={active}
            aria-label="Segurar para acionar SOS"
            className={`relative size-56 rounded-full grid place-items-center select-none transition-transform active:scale-95 ${
              active
                ? "bg-destructive text-destructive-foreground"
                : silent
                  ? "bg-zinc-800 text-zinc-100"
                  : "bg-destructive text-destructive-foreground shadow-2xl shadow-destructive/30"
            }`}
          >
            <span
              className="absolute inset-0 rounded-full border-4 border-white/30"
              style={{
                clipPath: `inset(0 ${100 - progress * 100}% 0 0)`,
                transition: holding ? "none" : "clip-path 200ms",
              }}
              aria-hidden
            />
            <div className="text-center">
              <ShieldAlert className="size-12 mx-auto" aria-hidden />
              <p className="mt-2 text-2xl font-bold tracking-tight">
                {active ? "ATIVO" : "SOS"}
              </p>
              <p className="text-[11px] opacity-90 mt-1">
                {active ? "Toque em cancelar abaixo" : "Pressione e segure"}
              </p>
            </div>
          </button>
        </div>

        {active ? (
          <Button
            variant="outline"
            onClick={cancelSos}
            className="mt-6 w-full h-12 rounded-full"
          >
            Cancelar SOS
          </Button>
        ) : null}
      </Card>

      <div className="mt-4 grid gap-3">
        <ActionRow
          icon={<Phone className="size-5" />}
          title="Ligar para a polícia"
          desc={`Discagem direta para ${POLICE_NUMBER}`}
          href={`tel:${POLICE_NUMBER}`}
        />
        <ActionRow
          icon={<MessageCircle className="size-5" />}
          title="Avisar contatos"
          desc={`${contacts.length} contato(s) cadastrados`}
          onClick={() => toast.success(`Mensagem enviada a ${contacts.length} contato(s)`)}
        />
        <ActionRow
          icon={<MapPin className="size-5" />}
          title="Compartilhar localização"
          desc="Envia link em tempo real"
          onClick={() => toast.success("Localização compartilhada")}
        />
      </div>

      <p className="mt-4 text-[11px] text-muted-foreground text-center">
        Mensagem automática: <span className="italic">“{SOS_MESSAGE}”</span>
      </p>
    </AppShell>
  );
}

function ActionRow({
  icon,
  title,
  desc,
  href,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href?: string;
  onClick?: () => void;
}) {
  const inner = (
    <Card className="p-4 rounded-2xl border-border/60 flex items-center gap-3 active:scale-[0.99] transition">
      <div className="size-11 rounded-2xl bg-primary/10 text-primary grid place-items-center">
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </Card>
  );
  if (href)
    return (
      <a href={href} className="block">
        {inner}
      </a>
    );
  return (
    <button onClick={onClick} className="block w-full">
      {inner}
    </button>
  );
}
