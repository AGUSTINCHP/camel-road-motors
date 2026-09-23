import { cn } from "@/lib/utils";
import logoMark from "@/assets/logo-mark.png";
import logoMarkWhite from "@/assets/logo-mark-white.png";
import logoFull from "@/assets/logo-full.png";
import logoFullWhite from "@/assets/logo-full-white.png";

export function Wordmark({
  className,
  tagline = true,
  inverted = false,
}: {
  className?: string;
  tagline?: boolean;
  inverted?: boolean;
}) {
  const src = tagline
    ? inverted
      ? logoFullWhite
      : logoFull
    : inverted
      ? logoMarkWhite
      : logoMark;

  return (
    <img
      src={src}
      alt="Suzuki Motors — compra venta de vehículos usados"
      className={cn("h-8 w-auto object-contain", className)}
    />
  );
}
