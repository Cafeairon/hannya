import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useDevice, useLocations, useSosEvents, uid } from "@/lib/storage";
import {
  Bluetooth,
  BatteryFull,
  Sun,
  KeyRound,
  Radio,
  Sparkles,
  CheckCircle2,
  XCircle,
  Loader2,
  ShieldAlert,
  MapPin,
  RefreshCw,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/_paired/app")({
  head: () => ({
    meta: [
      { title: "SafeHer — Segurança feminina urbana" },
      {
        name: "description",
        content:
          "SafeHer conecta seu dispositivo físico de segurança (gloss + chaveiros) com rastreio contínuo e SOS externo ao app.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [device, setDevice] = useDevice();
  const [, setLocations] = useLocations();
  const [sos, setSos] = useSosEvents();
  const [code, setCode] = useState(device.trackingCode ?? "");

  const connected = device.status === "connected";

  // Sincronização contínua simulada quando conectado
  useEffect(() => {
    if (!connected) return;
    const id = setInterval(() => {
      setDevice((d) => ({
        ...d,
        lastSync: Date.now(),
        // Carga solar lenta (+1 a cada ciclo, máx 100)
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

  const connect = () => {
    if (!code.trim()) return;
    setDevice((d) => ({ ...d, trackingCode: code.trim(), status: "searching" }));
    setTimeout(() => {
      setDevice((d) => ({
        ...d,
        status: "connected",
        battery: 78,
        solarCharging: true,
        lastSync: Date.now(),
        components: { gloss: true, tracker: true, sos: true },
      }));
      toast.success("Dispositivo SafeHer conectado");
    }, 1600);
  };

  const reconnect = () => {
    setDevice((d) => ({ ...d, status: "searching" }));
    setTimeout(() => {
      setDevice((d) => ({ ...d, status: "connected", lastSync: Date.now() }));
    }, 1200);
  };

  const disconnect = () => {
    setDevice((d) => ({ ...d, status: "disconnected" }));
  };

  // Simula um botão SOS físico (apenas para demonstração)
  const simulateDeviceSos = () => {
    setSos((arr) => [
      ...arr,
      { id: uid(), ts: Date.now(), source: "device", resolved: false },
    ]);
    toast.error("SOS recebido do dispositivo físico");
  };

  const activeSos = sos.find((s) => !s.resolved);

  return (
    <AppShell
      title="Olá 👋"
      subtitle="Seu dispositivo SafeHer é o seu principal escudo. O app monitora e complementa."
    >
      {activeSos ? (
        <Card className="p-4 rounded-3xl border-destructive/40 bg-destructive/10">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-destructive text-destructive-foreground grid place-items-center animate-pulse">
              <ShieldAlert className="size-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-destructive">SOS ATIVO</p>
              <p className="text-xs text-destructive/80">
                Acionado pelo botão físico · contatos e localização notificados
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

      {/* Status do dispositivo físico */}
      <Card className={`${activeSos ? "mt-4" : ""} p-5 rounded-3xl border-border/60 shadow-sm`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-primary/10 grid place-items-center">
              <Bluetooth className="size-5 text-primary" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-medium">Dispositivo SafeHer</p>
              <StatusBadge status={device.status} />
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm font-medium justify-end">
              <BatteryFull className="size-4 text-primary" aria-hidden />
              {connected ? `${device.battery}%` : "—"}
            </div>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1 justify-end">
              <Sun className="size-3 text-amber-500" />
              {device.solarCharging && connected ? "carga solar ativa" : "bateria"}
            </p>
          </div>
        </div>

        {device.trackingCode ? (
          <p className="mt-4 text-xs text-muted-foreground">
            Código: <span className="font-mono">{device.trackingCode}</span>
          </p>
        ) : null}

        {device.status === "disconnected" ? (
          <div className="mt-4 space-y-2">
            <label htmlFor="code" className="text-xs text-muted-foreground">
              Número de rastreio do dispositivo
            </label>
            <div className="flex gap-2">
              <Input
                id="code"
                placeholder="Ex.: SH-2840-91"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="h-12"
              />
              <Button onClick={connect} className="h-12 px-5">
                Conectar
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex gap-2">
            <Button
              variant="secondary"
              onClick={reconnect}
              className="flex-1 h-11"
              disabled={device.status === "searching"}
            >
              <RefreshCw className="size-4" />
              Reconectar
            </Button>
            <Button variant="outline" onClick={disconnect} className="h-11">
              Desconectar
            </Button>
          </div>
        )}
      </Card>

      {/* Componentes do kit */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <ComponentTile
          icon={<Sparkles className="size-5" />}
          label="Gloss"
          paired={device.components.gloss && connected}
        />
        <ComponentTile
          icon={<Radio className="size-5" />}
          label="Rastreador"
          paired={device.components.tracker && connected}
        />
        <ComponentTile
          icon={<KeyRound className="size-5" />}
          label="Botão SOS"
          paired={device.components.sos && connected}
        />
      </div>

      <p className="mt-3 text-[11px] text-muted-foreground text-center">
        O botão SOS funciona <strong>sem o celular</strong>. GPS sempre ativo.
      </p>

      {/* Atalhos */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link to="/location">
          <Card className="p-4 rounded-2xl border-border/60 h-full">
            <MapPin className="size-5 text-primary" />
            <p className="text-sm font-semibold mt-2">Localização em tempo real</p>
            <p className="text-xs text-muted-foreground">Ver mapa e histórico</p>
          </Card>
        </Link>
        <Link to="/incidents">
          <Card className="p-4 rounded-2xl border-border/60 h-full">
            <BookOpen className="size-5 text-primary" />
            <p className="text-sm font-semibold mt-2">Registrar ocorrência</p>
            <p className="text-xs text-muted-foreground">Relato com data e local</p>
          </Card>
        </Link>
      </div>

      {/* Simulador do botão físico (apenas para demonstração no protótipo) */}
      {connected && !activeSos ? (
        <button
          onClick={simulateDeviceSos}
          className="mt-4 w-full text-[11px] text-muted-foreground underline underline-offset-2"
        >
          Simular acionamento do botão SOS físico (protótipo)
        </button>
      ) : null}
    </AppShell>
  );
}

function StatusBadge({ status }: { status: "disconnected" | "searching" | "connected" }) {
  if (status === "connected")
    return (
      <p className="flex items-center gap-1 text-xs text-emerald-600">
        <CheckCircle2 className="size-3.5" /> Conectado
      </p>
    );
  if (status === "searching")
    return (
      <p className="flex items-center gap-1 text-xs text-amber-600">
        <Loader2 className="size-3.5 animate-spin" /> Procurando dispositivo…
      </p>
    );
  return (
    <p className="flex items-center gap-1 text-xs text-muted-foreground">
      <XCircle className="size-3.5" /> Desconectado
    </p>
  );
}

function ComponentTile({
  icon,
  label,
  paired,
}: {
  icon: React.ReactNode;
  label: string;
  paired: boolean;
}) {
  return (
    <Card className="p-3 rounded-2xl border-border/60 text-center">
      <div
        className={`mx-auto size-10 rounded-2xl grid place-items-center ${
          paired ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        }`}
      >
        {icon}
      </div>
      <p className="mt-2 text-xs font-medium">{label}</p>
      <p className={`text-[10px] ${paired ? "text-emerald-600" : "text-muted-foreground"}`}>
        {paired ? "pareado" : "—"}
      </p>
    </Card>
  );
}
