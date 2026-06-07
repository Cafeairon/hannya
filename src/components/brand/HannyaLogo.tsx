import logoUrl from "@/assets/hannya-logo.png";

/**
 * Logo Hannya — ícone oficial da marca (máscara dourada sobre fundo vermelho).
 */
export function HannyaLogo({
  className = "",
  title = "Hannya",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <img
      src={logoUrl}
      alt={title}
      className={className}
      draggable={false}
    />
  );
}
