import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDevice, useLocations } from "@/lib/storage";
import { MapPin, Share2, History, Radio } from "lucide-react";
import { toast } from "sonner";
import { useMemo } from "react";

export const Route = createFileRoute("/location")({
  head: () => ({ meta: [{ title: "Localização — SafeHer" }] }),
  component: LocationPage,
});

function LocationPage() {
  const [device] = useDevice();
  const [locations, setLocations] = useLocations();
  const connected = device.status === "connected";
  const last = locations[locations.length - 1];

  // Normaliza pontos para um mini-mapa SVG (0..100)
  const path = useMemo(() => {
    if (locations.length < 2) return "";
    const lats = locations.map((p) => p.lat);
    const lngs = locations.map((p) => p.lng);
    const minLat = Math.min(...lats),
      maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs),
      maxLng = Math.max(...lngs);
    const rLat = Math.max(1e-6, maxLat - minLat);
    const rLng = Math.max(1e-6, maxLng - minLng);
    return locations
      .map((p, i) => {
        const x = ((p.lng - minLng) / rLng) * 90 + 5;
        const y = 95 - ((p.lat - minLat) / rLat) * 90;
        return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");
  }, [locations]);

  const share = () => {
    if (!last) return toast("Sem localização ainda");
    const url = `https://maps.google.com/?q=${last.lat},${last.lng}`;
    navigator.clipboard?.writeText(url);
    toast.success("Link de localização copiado");
  };

  return (
    <AppShell
      title="Localização"
      subtitle="Rastreamento contínuo direto do dispositivo, mesmo com o app fechado."
    >
      <Card className="p-0 rounded-3xl overflow-hidden border-border/60">
        <div className="relative h-56 bg-gradient-to-br from-accent via-secondary to-primary/20">
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            {path && (
              <path
                d={path}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.7"
              />
            )}
            {last && (
              <circle cx={50} cy={50} r="2" fill="var(--primary)">
                <animate attributeName="r" values="2;5;2" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
          </svg>
          <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/90 text-xs font-medium shadow">
            <span
              className={`size-2 rounded-full ${
                connected ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"
              }`}
            />
            {connected ? "ao vivo" : "offline"}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-primary/10 text-primary grid place-items-center">
              <MapPin className="size-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Posição atual</p>
              <p className="text-xs text-muted-foreground font-mono">
                {last ? `${last.lat.toFixed(5)}, ${last.lng.toFixed(5)}` : "Aguardando sinal…"}
              </p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button onClick={share} className="h-11">
              <Share2 className="size-4" />
              Compartilhar
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setLocations([]);
                toast("Histórico limpo");
              }}
              className="h-11"
            >
              <History className="size-4" />
              Limpar histórico
            </Button>
          </div>
        </div>
      </Card>

      <Card className="mt-4 p-4 rounded-3xl border-border/60">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-emerald-50 text-emerald-600 grid place-items-center">
            <Radio className="size-5" />
          </div>
          <div>
            <p className="text-sm font-medium">Rastreador contínuo</p>
            <p className="text-xs text-muted-foreground">
              O chaveiro rastreador transmite a posição mesmo sem o celular por perto.
            </p>
          </div>
        </div>
      </Card>

      <div className="mt-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
          Histórico recente
        </p>
        <ul className="mt-2 space-y-2">
          {locations.length === 0 ? (
            <Card className="p-4 rounded-2xl text-xs text-muted-foreground text-center">
              Nenhum ponto registrado.
            </Card>
          ) : (
            locations
              .slice(-8)
              .reverse()
              .map((p) => (
                <Card key={p.ts} className="p-3 rounded-2xl border-border/60 flex items-center gap-3">
                  <MapPin className="size-4 text-primary" />
                  <div className="flex-1 text-xs">
                    <p className="font-mono">
                      {p.lat.toFixed(5)}, {p.lng.toFixed(5)}
                    </p>
                    <p className="text-muted-foreground">
                      {new Date(p.ts).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </Card>
              ))
          )}
        </ul>
      </div>
    </AppShell>
  );
}
