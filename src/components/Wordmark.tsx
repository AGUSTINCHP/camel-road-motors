import { cn } from "@/lib/utils";

export function Wordmark({
  className,
  tagline = true,
}: {
  className?: string;
  tagline?: boolean;
}) {
  return (
    <span className={cn("inline-flex flex-col leading-none", className)}>
      <span className="relative inline-block font-display text-[1.35rem] font-semibold tracking-[0.34em] sm:text-2xl">
        <span
          aria-hidden
          className="absolute inset-0 translate-y-[2px] text-transparent opacity-40"
          style={{ WebkitTextStroke: "1px currentColor" }}
        >
          SUZUKI
        </span>
        <span
          aria-hidden
          className="absolute inset-0 translate-y-[4px] text-transparent opacity-20"
          style={{ WebkitTextStroke: "1px currentColor" }}
        >
          SUZUKI
        </span>
        <span className="relative">SUZUKI</span>
      </span>
      {tagline ? (
        <span className="eyebrow mt-2 text-[0.55rem] tracking-[0.42em] opacity-60">Motors</span>
      ) : null}
    </span>
  );
}
