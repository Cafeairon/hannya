import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Recuperar senha — SafeHer" }] }),
  component: ResetPage,
});

function ResetPage() {
  const [email, setEmail] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [busy, setBusy] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash.includes("type=recovery")) setIsRecovery(true);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((e) => {
      if (e === "PASSWORD_RECOVERY") setIsRecovery(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Enviamos um link para o seu e-mail");
  };

  const updatePwd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd.length < 8) return toast.error("Mínimo 8 caracteres");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: newPwd });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Senha atualizada! Faça login novamente.");
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  return (
    <div className="min-h-screen px-5 py-8">
      <Link to="/auth" search={{ mode: "login" }} className="inline-flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <ArrowLeft className="size-4" /> Voltar
      </Link>
      <div className="flex items-center gap-3 mb-6">
        <div className="size-12 rounded-2xl bg-primary/15 grid place-items-center">
          <ShieldAlert className="size-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Recuperar senha</h1>
      </div>

      {isRecovery ? (
        <form onSubmit={updatePwd} className="space-y-4">
          <p className="text-sm text-muted-foreground">Defina sua nova senha.</p>
          <div className="space-y-1.5">
            <Label>Nova senha</Label>
            <Input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} className="h-12" />
          </div>
          <Button type="submit" disabled={busy} className="w-full h-14 rounded-2xl">
            {busy ? "Salvando…" : "Salvar nova senha"}
          </Button>
        </form>
      ) : (
        <form onSubmit={sendEmail} className="space-y-4">
          <p className="text-sm text-muted-foreground">Informe o e-mail da sua conta. Enviaremos um link de recuperação.</p>
          <div className="space-y-1.5">
            <Label>E-mail</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12" />
          </div>
          <Button type="submit" disabled={busy} className="w-full h-14 rounded-2xl">
            {busy ? "Enviando…" : "Enviar link de recuperação"}
          </Button>
        </form>
      )}
    </div>
  );
}
