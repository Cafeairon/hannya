import logoUrl from "@/assets/hannya-logo.png";
import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg" | "xl";

const SIZE_CLASSES: Record<LogoSize, string> = {
  sm: "size-7",
  md: "size-12",
  lg: "size-16",
  xl: "size-28",
};

/**
 * Logo Hannya — ícone oficial da marca (máscara dourada sobre fundo vermelho).
 * Use `size` para manter proporção consistente entre telas.
 */
export function HannyaLogo({
  className = "",
  title = "Hannya",
  size,
}: {
  className?: string;
  title?: string;
  size?: LogoSize;
}) {
  return (
    <img
      src={logoUrl}
      alt={title}
      className={cn(
        "object-cover rounded-[inherit] shrink-0",
        size && SIZE_CLASSES[size],
        className,
      )}
      draggable={false}
    />
  );
}
