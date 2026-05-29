/**
 * Peônia japonesa minimalista — usada como detalhe decorativo discreto.
 * Pétalas em arcos sobrepostos, traço fino, sem preenchimento pesado.
 */
export function Peony({
  className = "",
  filled = false,
}: {
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="24" cy="24" r="3" />
      <path d="M24 21 C 20 14, 14 14, 12 18 C 10 22, 14 25, 21 25" />
      <path d="M24 21 C 28 14, 34 14, 36 18 C 38 22, 34 25, 27 25" />
      <path d="M24 27 C 20 34, 14 34, 12 30 C 10 26, 14 23, 21 23" />
      <path d="M24 27 C 28 34, 34 34, 36 30 C 38 26, 34 23, 27 23" />
      <path d="M21 21 C 18 17, 18 14, 21 12" opacity="0.7" />
      <path d="M27 21 C 30 17, 30 14, 27 12" opacity="0.7" />
    </svg>
  );
}

/** Faixa decorativa de peônias para usar como fundo suave. */
export function PeonyField({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden>
      <Peony className="absolute -top-6 -right-4 size-28 text-primary/10" />
      <Peony className="absolute top-32 -left-8 size-24 text-primary/[0.06]" />
      <Peony className="absolute bottom-10 right-2 size-20 text-primary/[0.08]" />
    </div>
  );
}
