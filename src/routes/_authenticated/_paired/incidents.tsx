import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useIncidents, useLocations, uid, type Incident } from "@/lib/storage";
import { FileText, Plus, Trash2, Download, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/incidents")({
  head: () => ({ meta: [{ title: "Ocorrências — SafeHer" }] }),
  component: IncidentsPage,
});

const TYPES: { value: Incident["type"]; label: string }[] = [
  { value: "assedio", label: "Assédio" },
  { value: "perseguicao", label: "Perseguição" },
  { value: "violencia", label: "Violência" },
  { value: "outro", label: "Outro" },
];

function IncidentsPage() {
  const [incidents, setIncidents] = useIncidents();
  const [locations] = useLocations();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<Incident, "id" | "createdAt" | "location">>({
    type: "assedio",
    description: "",
    aggressor: "",
    notes: "",
  });

  const save = () => {
    if (!form.description.trim()) return toast.error("Descreva o ocorrido");
    const last = locations[locations.length - 1];
    const incident: Incident = {
      id: uid(),
      createdAt: Date.now(),
      type: form.type,
      description: form.description.trim(),
      aggressor: form.aggressor.trim(),
      notes: form.notes.trim(),
      location: last ? { lat: last.lat, lng: last.lng } : null,
    };
    setIncidents((arr) => [incident, ...arr]);
    setForm({ type: "assedio", description: "", aggressor: "", notes: "" });
    setOpen(false);
    toast.success("Ocorrência registrada");
  };

  const remove = (id: string) => {
    setIncidents((arr) => arr.filter((i) => i.id !== id));
  };

  const exportJson = (i: Incident) => {
    const blob = new Blob([JSON.stringify(i, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ocorrencia-${i.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell
      title="Ocorrências"
      subtitle="Registre relatos com data, local e detalhes para facilitar denúncias."
    >
      {!open ? (
        <Button onClick={() => setOpen(true)} className="w-full h-12 rounded-2xl">
          <Plus className="size-4" />
          Nova ocorrência
        </Button>
      ) : (
        <Card className="p-4 rounded-3xl border-border/60 space-y-3">
          <div>
            <Label className="text-xs">Tipo</Label>
            <div className="mt-1 grid grid-cols-2 gap-2">
              {TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type: t.value }))}
                  className={`h-10 rounded-xl text-xs font-medium border transition ${
                    form.type === t.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="desc" className="text-xs">
              Descrição do ocorrido *
            </Label>
            <Textarea
              id="desc"
              rows={4}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="O que aconteceu? Onde? Quem estava por perto?"
            />
          </div>
          <div>
            <Label htmlFor="agg" className="text-xs">
              Características do agressor
            </Label>
            <Input
              id="agg"
              value={form.aggressor}
              onChange={(e) => setForm((f) => ({ ...f, aggressor: e.target.value }))}
              placeholder="Altura, roupa, voz, veículo…"
            />
          </div>
          <div>
            <Label htmlFor="notes" className="text-xs">
              Observações
            </Label>
            <Textarea
              id="notes"
              rows={2}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Testemunhas, provas, contexto…"
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Data, hora e localização atual serão salvas automaticamente.
          </p>
          <div className="flex gap-2">
            <Button onClick={save} className="flex-1 h-11">
              Salvar
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)} className="h-11">
              Cancelar
            </Button>
          </div>
        </Card>
      )}

      <div className="mt-4 space-y-3">
        {incidents.length === 0 ? (
          <Card className="p-6 rounded-3xl border-border/60 text-center">
            <FileText className="size-8 mx-auto text-muted-foreground" />
            <p className="mt-2 text-sm font-medium">Nenhuma ocorrência registrada</p>
            <p className="text-xs text-muted-foreground">
              Seus relatos ficam organizados aqui para uso posterior.
            </p>
          </Card>
        ) : (
          incidents.map((i) => (
            <Card key={i.id} className="p-4 rounded-2xl border-border/60">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {TYPES.find((t) => t.value === i.type)?.label}
                </span>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => exportJson(i)}>
                    <Download className="size-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(i.id)}>
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-sm">{i.description}</p>
              {i.aggressor ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  <strong>Agressor:</strong> {i.aggressor}
                </p>
              ) : null}
              {i.notes ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  <strong>Obs.:</strong> {i.notes}
                </p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3" />
                  {new Date(i.createdAt).toLocaleString("pt-BR")}
                </span>
                {i.location ? (
                  <span className="inline-flex items-center gap-1 font-mono">
                    <MapPin className="size-3" />
                    {i.location.lat.toFixed(4)}, {i.location.lng.toFixed(4)}
                  </span>
                ) : null}
              </div>
            </Card>
          ))
        )}
      </div>
    </AppShell>
  );
}
