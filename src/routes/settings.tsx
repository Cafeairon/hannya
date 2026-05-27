import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useDevice, useSettings } from "@/lib/storage";
import { Bell, EyeOff, MapPin, Lock, Info } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Ajustes — SafeHer" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [settings, setSettings] = useSettings();
  const [device] = useDevice();

  const Row = ({
    icon,
    title,
    desc,
    value,
    onChange,
  }: {
    icon: React.ReactNode;
    title: string;
    desc: string;
    value: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <div className="flex items-center gap-3 py-3">
      <div className="size-10 rounded-2xl bg-primary/10 text-primary grid place-items-center">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );

  return (
    <AppShell title="Ajustes" subtitle="Personalize sua experiência e segurança.">
      <Card className="p-4 rounded-3xl border-border/60 divide-y divide-border/60">
        <Row
          icon={<EyeOff className="size-5" />}
          title="Modo silencioso"
          desc="SOS sem sons e com tela discreta"
          value={settings.silentMode}
          onChange={(v) => setSettings({ ...settings, silentMode: v })}
        />
        <Row
          icon={<MapPin className="size-5" />}
          title="Compartilhar localização"
          desc="Envia automaticamente aos contatos em SOS"
          value={settings.autoShareLocation}
          onChange={(v) => setSettings({ ...settings, autoShareLocation: v })}
        />
        <Row
          icon={<Bell className="size-5" />}
          title="Notificações push"
          desc="Alertas e lembretes de segurança"
          value={settings.pushNotifications}
          onChange={(v) => setSettings({ ...settings, pushNotifications: v })}
        />
      </Card>

      <Card className="mt-4 p-4 rounded-3xl border-border/60">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-emerald-50 text-emerald-600 grid place-items-center">
            <Lock className="size-5" />
          </div>
          <div>
            <p className="text-sm font-medium">Privacidade & criptografia</p>
            <p className="text-xs text-muted-foreground">
              Seus dados sensíveis são armazenados localmente neste protótipo e
              preparados para criptografia ponta a ponta.
            </p>
          </div>
        </div>
      </Card>

      <Card className="mt-4 p-4 rounded-3xl border-border/60">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-primary/10 text-primary grid place-items-center">
            <Info className="size-5" />
          </div>
          <div>
            <p className="text-sm font-medium">Sobre o SafeHer</p>
            <p className="text-xs text-muted-foreground">
              Projeto de extensão acadêmica focado em segurança feminina urbana.
              Dispositivo: {device.trackingCode ?? "não pareado"}.
            </p>
          </div>
        </div>
      </Card>
    </AppShell>
  );
}
