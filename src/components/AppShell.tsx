import { Link, useLocation } from "@tanstack/react-router";
import { Home, MapPin, FileText, Users, Settings as SettingsIcon } from "lucide-react";
import type { ReactNode } from "react";
import { HannyaLogo } from "@/components/brand/HannyaLogo";
import { Peony } from "@/components/brand/Peony";

type Tab = {
  to: "/app" | "/location" | "/incidents" | "/contacts" | "/settings";
  label: string;
  icon: typeof Home;
};

const TABS: Tab[] = [
  { to: "/app", label: "Início", icon: Home },
  { to: "/location", label: "Localização", icon: MapPin },
  { to: "/incidents", label: "Ocorrências", icon: FileText },
  { to: "/contacts", label: "Contatos", icon: Users },
  { to: "/settings", label: "Ajustes", icon: SettingsIcon },
];

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const { pathname } = useLocation();

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Peônias decorativas discretas */}
      <Peony className="pointer-events-none absolute -top-6 -right-6 size-36 text-primary/10" />
      <Peony className="pointer-events-none absolute top-1/2 -left-10 size-32 text-primary/[0.06]" />

      <header className="relative px-5 pt-8 pb-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-primary grid place-items-center shadow-sm overflow-hidden">
            <HannyaLogo className="size-9" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-primary/80 leading-none">
              Hannya
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
          </div>
        </div>
        {subtitle ? (
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </header>

      <main className="relative flex-1 px-5 pb-28">{children}</main>

      <nav
        aria-label="Navegação principal"
        className="fixed bottom-0 inset-x-0 mx-auto max-w-md border-t border-border bg-card/95 backdrop-blur"
      >
        <ul className="grid grid-cols-5">
          {TABS.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={`flex flex-col items-center justify-center gap-1 py-3 text-[11px] font-medium transition-colors ${
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label={label}
                >
                  <span
                    className={`grid place-items-center size-9 rounded-full ${
                      active ? "bg-primary/15" : ""
                    }`}
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
