import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useContacts, uid, type Contact } from "@/lib/storage";
import { Plus, Trash2, Pencil, Phone, Star } from "lucide-react";

export const Route = createFileRoute("/_authenticated/_paired/contacts")({
  head: () => ({ meta: [{ title: "Contatos — SafeHer" }] }),
  component: ContactsPage,
});

const RELATIONS = ["Mãe", "Pai", "Irmã(o)", "Parceiro(a)", "Amiga(o)", "Familiar", "Outro"];

function ContactsPage() {
  const [contacts, setContacts] = useContacts();
  const [editing, setEditing] = useState<Contact | null>(null);
  const [open, setOpen] = useState(false);

  const sorted = [...contacts].sort((a, b) => a.priority - b.priority);

  const save = (c: Contact) => {
    setContacts((list) => {
      const exists = list.some((x) => x.id === c.id);
      return exists ? list.map((x) => (x.id === c.id ? c : x)) : [...list, c];
    });
    setOpen(false);
    setEditing(null);
  };

  const remove = (id: string) => setContacts((list) => list.filter((c) => c.id !== id));

  return (
    <AppShell title="Contatos de emergência" subtitle="Quem será avisado em caso de SOS.">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => setEditing(null)}
            className="w-full h-12 rounded-full mb-4"
          >
            <Plus className="size-4" /> Adicionar contato
          </Button>
        </DialogTrigger>
        <ContactDialog initial={editing} onSave={save} />
      </Dialog>

      {sorted.length === 0 ? (
        <Card className="p-8 rounded-3xl text-center border-dashed">
          <p className="text-sm text-muted-foreground">
            Nenhum contato ainda. Adicione pessoas de confiança para serem alertadas
            automaticamente.
          </p>
        </Card>
      ) : (
        <ul className="space-y-3">
          {sorted.map((c) => (
            <li key={c.id}>
              <Card className="p-4 rounded-2xl border-border/60">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-full bg-primary/10 text-primary grid place-items-center font-semibold">
                    {c.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {c.relation} · {c.phone}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-0.5 text-[11px] text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                    <Star className="size-3" /> P{c.priority}
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <a href={`tel:${c.phone}`} className="flex-1">
                    <Button variant="secondary" className="w-full h-10">
                      <Phone className="size-4" /> Ligar
                    </Button>
                  </a>
                  <Button
                    variant="outline"
                    className="h-10"
                    onClick={() => {
                      setEditing(c);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-10 text-destructive"
                    onClick={() => remove(c.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}

function ContactDialog({
  initial,
  onSave,
}: {
  initial: Contact | null;
  onSave: (c: Contact) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [relation, setRelation] = useState(initial?.relation ?? "Familiar");
  const [priority, setPriority] = useState(String(initial?.priority ?? 1));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    onSave({
      id: initial?.id ?? uid(),
      name: name.trim().slice(0, 80),
      phone: phone.trim().slice(0, 20),
      relation,
      priority: Math.min(5, Math.max(1, Number(priority) || 1)),
    });
  };

  return (
    <DialogContent className="rounded-3xl">
      <DialogHeader>
        <DialogTitle>{initial ? "Editar contato" : "Novo contato"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <Label htmlFor="n">Nome</Label>
          <Input id="n" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="p">Telefone</Label>
          <Input
            id="p"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Grau de proximidade</Label>
          <Select value={relation} onValueChange={setRelation}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RELATIONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Prioridade de aviso (1 = primeiro)</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  P{n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button type="submit" className="w-full h-11">
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
