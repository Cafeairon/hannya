/**
 * Logo Hannya — interpretação minimalista e não-assustadora da máscara nō:
 * rosto triangular sereno, dois pequenos chifres estilizados, olhos amêndoa,
 * traço delicado. Transmite proteção, força e vigilância feminina.
 */
export function HannyaLogo({
  className = "",
  title = "Hannya",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label={title}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Contorno do rosto: triangular, suave nas curvas */}
      <path d="M32 9 C 20 16, 14 28, 17 42 C 19 52, 26 58, 32 58 C 38 58, 45 52, 47 42 C 50 28, 44 16, 32 9 Z" />
      {/* Chifres curtos e elegantes */}
      <path d="M24 12 C 22 8, 20 7, 18 8" />
      <path d="M40 12 C 42 8, 44 7, 46 8" />
      {/* Olhos amêndoa */}
      <path d="M22 30 Q 26 27, 29 30 Q 26 33, 22 30 Z" fill="currentColor" stroke="none" />
      <path d="M35 30 Q 39 27, 42 30 Q 39 33, 35 30 Z" fill="currentColor" stroke="none" />
      {/* Marca central testa — flor */}
      <circle cx="32" cy="20" r="1.4" fill="currentColor" stroke="none" />
      {/* Boca discreta — linha calma, sem dentes */}
      <path d="M27 44 Q 32 47, 37 44" />
    </svg>
  );
}
