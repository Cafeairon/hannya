import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useDevice,
  useLocations,
  useSosEvents,
  useContacts,
  useIncidents,
  uid,
} from "@/lib/storage";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import {
  BatteryFull,
  CheckCircle2,
  XCircle,
  Loader2,
  ShieldAlert,
  MapPin,
  Phone,
  Radio,
  ChevronRight,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/_paired/app")({
  head: () => ({
    meta: [
      { title: "Hannya — Início" },
      {
        name: "description",
        content:
          "Hannya conecta seu dispositivo físico de rastreio e botão SOS, mantendo proteção contínua e acesso rápido em emergências.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { user } = useAuth();
  const [device, setDevice] = useDevice();
  const [locations, setLocations] = useLocations();
  const [sos, setSos] = useSosEvents();
  const [contacts] = useContacts();
  const [incidents] = useIncidents();
  const [firstName, setFirstName] = useState<string | null>(null);

  const connected = device.status === "connected";
  const lastPoint = locations[locations.length - 1];

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.full_name) setFirstName(data.full_name.split(" ")[0]);
      });
  }, [user]);

  // Simulação leve de rastreio em tempo real quando conectado.
  useEffect(() => {
    if (!connected) return;
    const id = setInterval(() => {
      setDevice((d) => ({
        ...d,
        lastSync: Date.now(),
        battery: d.solarCharging ? Math.min(100, d.battery + 1) : d.battery,
      }));
      setLocations((arr) => {
        const last = arr[arr.length - 1];
        const lat = (last?.lat ?? -23.5505) + (Math.random() - 0.5) * 0.0008;
        const lng = (last?.lng ?? -46.6333) + (Math.random() - 0.5) * 0.0008;
        return [...arr.slice(-199), { ts: Date.now(), lat, lng }];
      });
    }, 5000);
    return () => clearInterval(id);
  }, [connected, setDevice, setLocations]);

  const activeSos = sos.find((s) => !s.resolved);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 5) return "Boa madrugada";
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  const topContact = contacts.slice().sort((a, b) => a.priority - b.priority)[0];

  const simulateDeviceSos = () => {
    setSos((arr) => [
      ...arr,
      { id: uid(), ts: Date.now(), source: "device", resolved: false },
    ]);
    toast.error("SOS recebido do dispositivo físico");
  };

  return (
    <AppShell
      title={firstName ? `${greeting}, ${firstName}` : greeting}
      subtitle="Você está protegida. Tudo à mão de um toque."
    >
      {/* Alerta SOS ativo */}
      {activeSos ? (
        <Card className="p-4 rounded-3xl border-primary/40 bg-primary/10 mb-4">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-primary text-primary-foreground grid place-items-center animate-pulse">
              <ShieldAlert className="size-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-primary">SOS ATIVO</p>
              <p className="text-xs text-primary/80">
                Acionado pelo botão físico · contatos notificados
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setSos((arr) =>
                  arr.map((s) => (s.id === activeSos.id ? { ...s, resolved: true } : s))
                )
              }
            >
              Encerrar
            </Button>
          </div>
        </Card>
      ) : null}

      {/* Cartão principal: rastreador */}
      <Card className="p-5 rounded-3xl border-border/60 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-primary/15 text-primary grid place-items-center">
              <Radio className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium">Rastreador</p>
              <StatusBadge status={device.status} />
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm font-medium justify-end">
              <BatteryFull className="size-4 text-primary" />
              {connected ? `${device.battery}%` : "—"}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {device.lastSync
                ? `Sinc. ${new Date(device.lastSync).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                : "sem sincronia"}
            </p>
          </div>
        </div>
      </Card>

      {/* Localização em tempo real */}
      <Link to="/location" className="block mt-3">
        <Card className="p-4 rounded-3xl border-border/60 flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-primary/15 text-primary grid place-items-center">
            <MapPin className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Localização em tempo real</p>
            <p className="text-xs text-muted-foreground truncate">
              {lastPoint
                ? `${lastPoint.lat.toFixed(4)}, ${lastPoint.lng.toFixed(4)}`
                : "aguardando primeiro sinal"}
            </p>
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </Card>
      </Link>

      {/* Contato rápido */}
      <Card className="p-4 rounded-3xl border-border/60 mt-3">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-primary/15 text-primary grid place-items-center">
            <Phone className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Contato de emergência</p>
            <p className="text-xs text-muted-foreground truncate">
              {topContact ? `${topContact.name} · ${topContact.relation}` : "Nenhum contato cadastrado"}
            </p>
          </div>
          {topContact ? (
            <a href={`tel:${topContact.phone}`}>
              <Button size="sm" className="h-9 rounded-xl">
                Ligar
              </Button>
            </a>
          ) : (
            <Link to="/contacts">
              <Button size="sm" variant="outline" className="h-9 rounded-xl">
                Adicionar
              </Button>
            </Link>
          )}
        </div>
      </Card>

      {/* Histórico */}
      <Link to="/incidents" className="block mt-3">
        <Card className="p-4 rounded-3xl border-border/60 flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-primary/15 text-primary grid place-items-center">
            <FileText className="size-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Histórico de ocorrências</p>
            <p className="text-xs text-muted-foreground">
              {incidents.length} {incidents.length === 1 ? "registro" : "registros"}
            </p>
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </Card>
      </Link>

      {/* Botão de emergência discreto */}
      <button
        onClick={simulateDeviceSos}
        disabled={!!activeSos}
        className="mt-6 w-full h-12 rounded-2xl border border-primary/40 text-primary text-sm font-medium hover:bg-primary/5 transition-colors disabled:opacity-50"
      >
        Emergência discreta
      </button>
      <p className="mt-2 text-[11px] text-muted-foreground text-center">
        Em risco imediato, use o botão SOS físico no chaveiro — funciona sem o celular.
      </p>
    </AppShell>
  );
}

function StatusBadge({ status }: { status: "disconnected" | "searching" | "connected" }) {
  if (status === "connected")
    return (
      <p className="flex items-center gap-1 text-xs text-primary">
        <CheckCircle2 className="size-3.5" /> Conectado
      </p>
    );
  if (status === "searching")
    return (
      <p className="flex items-center gap-1 text-xs text-muted-foreground">
        <Loader2 className="size-3.5 animate-spin" /> Procurando…
      </p>
    );
  return (
    <p className="flex items-center gap-1 text-xs text-muted-foreground">
      <XCircle className="size-3.5" /> Desconectado
    </p>
  );
}
