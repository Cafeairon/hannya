import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { ShieldAlert, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => ({
    mode: (s.mode === "signup" ? "signup" : "login") as "login" | "signup",
  }),
  head: () => ({ meta: [{ title: "Entrar — SafeHer" }] }),
  component: AuthPage,
});

const onlyDigits = (v: string) => v.replace(/\D/g, "");

const signupSchema = z
  .object({
    full_name: z.string().trim().min(3, "Informe seu nome completo").max(120),
    cpf: z.string().transform(onlyDigits).pipe(z.string().length(11, "CPF deve ter 11 dígitos")),
    email: z.string().trim().email("E-mail inválido").max(255),
    phone: z.string().transform(onlyDigits).pipe(z.string().min(10, "Telefone inválido").max(15)),
    birth_date: z.string().min(1, "Informe sua data de nascimento"),
    password: z.string().min(8, "Mínimo 8 caracteres").max(72),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Senhas não conferem" });

const loginSchema = z.object({
  email: z.string().trim().email("E-mail inválido"),
  password: z.string().min(1, "Informe sua senha"),
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && session) navigate({ to: "/app", replace: true });
  }, [loading, session, navigate]);

  return (
    <div className="min-h-screen px-5 py-8">
      <Link to="/welcome" className="inline-flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <ArrowLeft className="size-4" /> Voltar
      </Link>
      <div className="flex items-center gap-3 mb-6">
        <div className="size-12 rounded-2xl bg-primary/15 grid place-items-center">
          <ShieldAlert className="size-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bem-vinda ao SafeHer</h1>
          <p className="text-sm text-muted-foreground">Sua segurança é nossa prioridade</p>
        </div>
      </div>

      <Tabs defaultValue={mode} className="w-full">
        <TabsList className="grid grid-cols-2 w-full h-12">
          <TabsTrigger value="login" className="h-10">Entrar</TabsTrigger>
          <TabsTrigger value="signup" className="h-10">Criar conta</TabsTrigger>
        </TabsList>
        <TabsContent value="login" className="mt-6"><LoginForm /></TabsContent>
        <TabsContent value="signup" className="mt-6"><SignupForm /></TabsContent>
      </Tabs>
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (fe[i.path[0] as string] = i.message));
      setErr(fe);
      return;
    }
    setErr({});
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setBusy(false);
    if (error) {
      toast.error(error.message === "Invalid login credentials" ? "E-mail ou senha incorretos" : error.message);
      return;
    }
    toast.success("Bem-vinda de volta!");
    navigate({ to: "/app", replace: true });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="E-mail" error={err.email}>
        <Input type="email" inputMode="email" autoComplete="email" value={email}
          onChange={(e) => setEmail(e.target.value)} className="h-12" />
      </Field>
      <Field label="Senha" error={err.password}>
        <div className="relative">
          <Input type={show ? "text" : "password"} autoComplete="current-password" value={password}
            onChange={(e) => setPassword(e.target.value)} className="h-12 pr-11" />
          <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </Field>
      <Link to="/reset-password" className="block text-sm text-primary text-right">Esqueci minha senha</Link>
      <Button type="submit" disabled={busy} className="w-full h-14 text-base rounded-2xl">
        {busy ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  );
}

function SignupForm() {
  const [f, setF] = useState({
    full_name: "", cpf: "", email: "", phone: "", birth_date: "", password: "", confirm: "",
  });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signupSchema.safeParse(f);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (fe[i.path[0] as string] = i.message));
      setErr(fe);
      toast.error("Confira os campos do formulário");
      return;
    }
    setErr({});
    setBusy(true);
    const d = parsed.data;
    const { error } = await supabase.auth.signUp({
      email: d.email,
      password: d.password,
      options: {
        emailRedirectTo: `${window.location.origin}/app`,
        data: {
          full_name: d.full_name,
          cpf: d.cpf,
          phone: d.phone,
          birth_date: d.birth_date,
        },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Conta criada! Vamos conectar seu dispositivo.");
    navigate({ to: "/onboarding", replace: true });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Nome completo" error={err.full_name}>
        <Input autoComplete="name" value={f.full_name} onChange={set("full_name")} className="h-12" />
      </Field>
      <Field label="CPF" error={err.cpf}>
        <Input inputMode="numeric" maxLength={14} placeholder="000.000.000-00" value={f.cpf} onChange={set("cpf")} className="h-12" />
      </Field>
      <Field label="E-mail" error={err.email}>
        <Input type="email" inputMode="email" autoComplete="email" value={f.email} onChange={set("email")} className="h-12" />
      </Field>
      <Field label="Telefone" error={err.phone}>
        <Input inputMode="tel" placeholder="(00) 00000-0000" value={f.phone} onChange={set("phone")} className="h-12" />
      </Field>
      <Field label="Data de nascimento" error={err.birth_date}>
        <Input type="date" value={f.birth_date} onChange={set("birth_date")} className="h-12" />
      </Field>
      <Field label="Senha" error={err.password}>
        <div className="relative">
          <Input type={show ? "text" : "password"} autoComplete="new-password" value={f.password} onChange={set("password")} className="h-12 pr-11" />
          <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </Field>
      <Field label="Confirmar senha" error={err.confirm}>
        <Input type={show ? "text" : "password"} autoComplete="new-password" value={f.confirm} onChange={set("confirm")} className="h-12" />
      </Field>
      <Button type="submit" disabled={busy} className="w-full h-14 text-base rounded-2xl">
        {busy ? "Criando conta…" : "Criar conta"}
      </Button>
      <p className="text-[11px] text-muted-foreground text-center">
        Seus dados são protegidos com criptografia e nunca compartilhados.
      </p>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
