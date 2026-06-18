/**
 * Flor fine line — inspirada em cerejeira/peônia japonesa.
 * Cinco pétalas arredondadas em torno de um miolo com estames,
 * traço fino e contínuo, sem preenchimento.
 */
export function Peony({ className = "" }: { className?: string; filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* 5 pétalas em pentagrama (rotação 72°) */}
      <g transform="translate(50 50)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <g key={deg} transform={`rotate(${deg})`}>
            {/* contorno externo da pétala */}
            <path d="M0 -6 C -14 -10, -18 -28, 0 -38 C 18 -28, 14 -10, 0 -6 Z" />
            {/* nervura central sutil */}
            <path d="M0 -8 L 0 -34" opacity="0.45" />
          </g>
        ))}
      </g>

      {/* miolo: círculo + estames pontilhados */}
      <circle cx="50" cy="50" r="4.5" />
      <g stroke="currentColor" strokeWidth="0.8" opacity="0.7">
        <line x1="50" y1="50" x2="52" y2="46" />
        <line x1="50" y1="50" x2="54" y2="49" />
        <line x1="50" y1="50" x2="53" y2="53" />
        <line x1="50" y1="50" x2="48" y2="54" />
        <line x1="50" y1="50" x2="46" y2="51" />
        <line x1="50" y1="50" x2="47" y2="47" />
      </g>
      <g fill="currentColor" opacity="0.7">
        <circle cx="52" cy="46" r="0.7" />
        <circle cx="54" cy="49" r="0.7" />
        <circle cx="53" cy="53" r="0.7" />
        <circle cx="48" cy="54" r="0.7" />
        <circle cx="46" cy="51" r="0.7" />
        <circle cx="47" cy="47" r="0.7" />
      </g>

      {/* haste e folha discreta */}
      <path d="M50 88 C 50 76, 50 66, 50 56" opacity="0.5" />
      <path d="M50 78 C 56 76, 62 78, 64 84 C 58 84, 52 82, 50 78 Z" opacity="0.5" />
    </svg>
  );
}

/** Composição decorativa de flores fine line. */
export function PeonyField({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden>
      <Peony className="absolute -top-6 -right-4 size-28 text-pink/25" />
      <Peony className="absolute top-32 -left-8 size-24 text-pink/20" />
      <Peony className="absolute bottom-10 right-2 size-20 text-pink/20" />
    </div>
  );
}
