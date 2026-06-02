import logoAsset from "@/assets/hannya-logo.svg.asset.json";

/**
 * Logo Hannya — imagem oficial da marca.
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
