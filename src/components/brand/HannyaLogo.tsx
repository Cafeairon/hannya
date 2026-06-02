import logoAsset from "@/assets/hannya-logo.png.asset.json";

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
      src={logoAsset.url}
      alt={title}
      className={className}
      draggable={false}
    />
  );
}
