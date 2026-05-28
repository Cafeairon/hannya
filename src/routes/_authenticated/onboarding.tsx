import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, KeyRound, Loader2, ShieldAlert, Sparkles, Radio } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useDevice } from "@/lib/storage";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({ meta: [{ title: "Conectar dispositivo — SafeHer" }] }),
  component: Onboarding,
});

const CODE_REGEX = /^[A-Z0-9-]{6,20}$/;

function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [, setLocalDevice] = useDevice();
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"input" | "validating" | "success">("input");
  const [hasDevice, setHasDevice] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("devices").select("id").eq("user_id", user.id).limit(1).then(({ data }) => {
      if (data && data.length > 0) navigate({ to: "/app", replace: true });
      else setHasDevice(false);
    });
  }, [user, navigate]);

  const pair = async (e: React.FormEvent) => {
    e.preventDefault();
    const c = code.trim().toUpperCase();
    if (!CODE_REGEX.test(c)) {
      toast.error("Código inválido. Use letras, números e traços (ex.: SH-2840-91).");
      return;
    }
    if (!user) return;
    setStep("validating");
    // Simula validação
    await new Promise((r) => setTimeout(r, 1400));
    const { error } = await supabase.from("devices").insert({
      user_id: user.id,
      tracking_code: c,
      status: "connected",
      battery: 82,
    });
    if (error) {
      setStep("input");
      toast.error(error.message.includes("duplicate") ? "Esse código já está vinculado a outra conta." : error.message);
      return;
    }
    setLocalDevice((d) => ({
      ...d,
      trackingCode: c,
      status: "connected",
      battery: 82,
      solarCharging: true,
      lastSync: Date.now(),
      components: { gloss: true, tracker: true, sos: true },
    }));
    setStep("success");
    setTimeout(() => navigate({ to: "/app", replace: true }), 1400);
  };

  if (hasDevice === null) {
    return <div className="min-h-screen grid place-items-center"><Loader2 className="size-6 animate-spin text-primary" /></div>;
  }

  if (step === "success") {
    return (
      <div className="min-h-screen px-6 py-10 flex flex-col items-center justify-center text-center bg-gradient-to-b from-primary/10 to-background">
        <div className="size-24 rounded-full bg-emerald-500/15 grid place-items-center animate-in zoom-in">
          <CheckCircle2 className="size-12 text-emerald-600" />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Dispositivo conectado!</h1>
        <p className="mt-2 text-sm text-muted-foreground">Você já está protegida. Levando você ao SafeHer…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="size-12 rounded-2xl bg-primary/15 grid place-items-center">
          <ShieldAlert className="size-6 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Etapa 2 de 2</p>
          <h1 className="text-2xl font-bold tracking-tight">Conecte seu dispositivo</h1>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Insira o código único de rastreio que veio na caixa do seu kit SafeHer. Ele aparece no verso do gloss e na embalagem do chaveiro.
      </p>

      <Card className="p-4 rounded-2xl border-border/60 mb-6">
        <p className="text-xs font-medium text-muted-foreground mb-3">Seu kit contém</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <Item icon={<Sparkles className="size-5" />} label="Gloss" />
          <Item icon={<Radio className="size-5" />} label="Rastreador" />
          <Item icon={<KeyRound className="size-5" />} label="Botão SOS" />
        </div>
      </Card>

      <form onSubmit={pair} className="space-y-4 flex-1">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Código de rastreio</label>
          <Input
            placeholder="SH-0000-00"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="h-14 text-center font-mono text-lg tracking-widest"
            disabled={step === "validating"}
            autoFocus
          />
        </div>
        <Button type="submit" disabled={step === "validating"} className="w-full h-14 text-base rounded-2xl">
          {step === "validating" ? (
            <><Loader2 className="size-4 animate-spin" /> Validando código…</>
          ) : (
            "Vincular dispositivo"
          )}
        </Button>
      </form>
    </div>
  );
}

function Item({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div>
      <div className="mx-auto size-10 rounded-2xl bg-primary/10 text-primary grid place-items-center">{icon}</div>
      <p className="mt-1.5 text-[11px] font-medium">{label}</p>
    </div>
  );
}
