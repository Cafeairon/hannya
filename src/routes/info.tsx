import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import {
  Shield,
  Moon,
  Scale,
  Phone,
  Heart,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/info")({
  head: () => ({ meta: [{ title: "Informações — SafeHer" }] }),
  component: InfoPage,
});

type Item = {
  icon: React.ReactNode;
  title: string;
  body: string;
  tone: "rose" | "violet" | "amber" | "sky" | "emerald";
};

const ITEMS: Item[] = [
  {
    icon: <AlertTriangle className="size-5" />,
    title: "Reconhecendo assédio",
    body: "Comentários invasivos, toques sem consentimento ou perseguição são assédio. Você não está exagerando — você tem o direito de dizer não.",
    tone: "rose",
  },
  {
    icon: <Moon className="size-5" />,
    title: "Dicas para deslocamentos noturnos",
    body: "Compartilhe sua rota com alguém de confiança, prefira ruas iluminadas, mantenha o telefone com bateria e use o SafeHer ativo no bolso.",
    tone: "violet",
  },
  {
    icon: <Shield className="size-5" />,
    title: "Como agir em situação de perigo",
    body: "Mantenha a calma, procure locais com pessoas (lojas, padarias, postos), acione o SOS do SafeHer e, se possível, registre detalhes do agressor.",
    tone: "amber",
  },
  {
    icon: <Scale className="size-5" />,
    title: "Seus direitos",
    body: "A Lei Maria da Penha e a Lei do Minuto Seguinte garantem proteção, atendimento prioritário e medidas protetivas. Procure uma Delegacia da Mulher.",
    tone: "sky",
  },
  {
    icon: <Heart className="size-5" />,
    title: "Apoio psicológico",
    body: "CVV — 188 (24h, gratuito). CRAS e CAPS oferecem acolhimento gratuito em todo o Brasil.",
    tone: "emerald",
  },
  {
    icon: <Phone className="size-5" />,
    title: "Telefones úteis",
    body: "Polícia Militar: 190 · Disque Denúncia da Mulher: 180 · SAMU: 192 · Bombeiros: 193.",
    tone: "rose",
  },
];

const toneClasses: Record<Item["tone"], string> = {
  rose: "bg-rose-50 text-rose-600",
  violet: "bg-violet-50 text-violet-600",
  amber: "bg-amber-50 text-amber-600",
  sky: "bg-sky-50 text-sky-600",
  emerald: "bg-emerald-50 text-emerald-600",
};

function InfoPage() {
  return (
    <AppShell title="Central informativa" subtitle="Conteúdo educativo e canais de apoio.">
      <Card className="p-4 rounded-3xl border-border/60 bg-gradient-to-br from-primary/10 to-accent">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="size-4" />
          <p className="text-xs font-semibold uppercase tracking-wider">Dica rápida</p>
        </div>
        <p className="mt-2 text-sm">
          Combine um <strong>código de palavra</strong> com alguém de confiança. Ao
          enviá-la por mensagem, essa pessoa saberá que você precisa de ajuda sem
          alertar quem está por perto.
        </p>
      </Card>

      <ul className="mt-4 space-y-3">
        {ITEMS.map((it) => (
          <li key={it.title}>
            <Card className="p-4 rounded-2xl border-border/60">
              <div className="flex gap-3">
                <div
                  className={`size-10 rounded-2xl grid place-items-center shrink-0 ${toneClasses[it.tone]}`}
                >
                  {it.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{it.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {it.body}
                  </p>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
