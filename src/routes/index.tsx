import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useDevice } from "@/lib/storage";
import { Bluetooth, BatteryFull, MapPin, RefreshCw, CheckCircle2, XCircle, Loader2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SafeHer — Segurança feminina urbana" },
      {
        name: "description",
        content:
          "SafeHer conecta seu dispositivo de segurança ao app, com SOS rápido, rastreio em tempo real e contatos de emergência.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [device, setDevice] = useDevice();
  const [code, setCode] = useState(device.trackingCode ?? "");

  // Simula bateria do dispositivo quando conectado
  useEffect(() => {
    if (device.status !== "connected") return;
    const id = setInterval(() => {
      setDevice((d) => ({ ...d, lastSync: Date.now() }));
    }, 15000);
    return () => clearInterval(id);
  }, [device.status, setDevice]);

  const connect = () => {
    if (!code.trim()) return;
    setDevice((d) => ({ ...d, trackingCode: code.trim(), status: "searching" }));
    setTimeout(() => {
      setDevice((d) => ({
        ...d,
        status: "connected",
        battery: 78,
        lastSync: Date.now(),
      }));
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

  return (
    <AppShell title="Olá 👋" subtitle="Você está protegida. Confira o status do seu dispositivo.">
      {/* Status do dispositivo */}
      <Card className="p-5 rounded-3xl border-border/60 shadow-sm">
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
            <div className="flex items-center gap-1 text-sm font-medium">
              <BatteryFull className="size-4 text-primary" aria-hidden />
              {device.status === "connected" ? `${device.battery}%` : "—"}
            </div>
            <p className="text-[11px] text-muted-foreground">bateria</p>
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

      {/* Mapa (placeholder) */}
      <Card className="mt-4 p-0 rounded-3xl overflow-hidden border-border/60">
        <div className="relative h-44 bg-gradient-to-br from-accent via-secondary to-primary/20">
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="mx-auto size-12 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-lg">
                <MapPin className="size-6" aria-hidden />
              </div>
              <p className="mt-2 text-sm font-medium">Sua localização atual</p>
              <p className="text-xs text-muted-foreground">
                {device.status === "connected"
                  ? "Compartilhamento ativo com contatos"
                  : "Conecte o dispositivo para ativar"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Atalhos rápidos */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <QuickTile title="Compartilhar localização" desc="Enviar agora aos contatos" />
        <QuickTile title="Modo silencioso" desc="SOS discreto, sem som" />
      </div>
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

function QuickTile({ title, desc }: { title: string; desc: string }) {
  return (
    <Card className="p-4 rounded-2xl border-border/60">
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
    </Card>
  );
}
