/**
 * Flor em fine line — traço delicado, sem preenchimento.
 * Pétalas finas em torno de um miolo discreto, estética japonesa minimalista.
 */
export function Peony({ className = "" }: { className?: string; filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* miolo */}
      <circle cx="32" cy="32" r="1.6" />
      <circle cx="32" cy="32" r="3.2" opacity="0.5" />

      {/* 8 pétalas finas em volta */}
      <g>
        <path d="M32 30 C 30 22, 26 18, 22 16 C 26 20, 28 26, 32 30 Z" />
        <path d="M32 30 C 34 22, 38 18, 42 16 C 38 20, 36 26, 32 30 Z" />
        <path d="M34 32 C 42 30, 46 26, 48 22 C 44 26, 38 28, 34 32 Z" />
        <path d="M34 34 C 42 36, 46 40, 48 44 C 44 40, 38 38, 34 34 Z" />
        <path d="M32 34 C 34 42, 38 46, 42 48 C 38 44, 36 38, 32 34 Z" />
        <path d="M32 34 C 30 42, 26 46, 22 48 C 26 44, 28 38, 32 34 Z" />
        <path d="M30 34 C 22 36, 18 40, 16 44 C 20 40, 26 38, 30 34 Z" />
        <path d="M30 32 C 22 30, 18 26, 16 22 C 20 26, 26 28, 30 32 Z" />
      </g>

      {/* hastes finas */}
      <path d="M32 48 C 32 54, 30 58, 26 60" opacity="0.5" />
      <path d="M32 48 C 32 54, 34 58, 38 60" opacity="0.5" />
    </svg>
  );
}

/** Faixa decorativa de flores fine line para usar como fundo suave. */
export function PeonyField({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden>
      <Peony className="absolute -top-6 -right-4 size-28 text-primary/20" />
      <Peony className="absolute top-32 -left-8 size-24 text-primary/15" />
      <Peony className="absolute bottom-10 right-2 size-20 text-primary/15" />
    </div>
  );
}
