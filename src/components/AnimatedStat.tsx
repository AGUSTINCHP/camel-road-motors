import { useCountUp } from "@/hooks/useCountUp";

export function AnimatedStat({ value, label }: { value: number; label: string }) {
  const { ref, value: current } = useCountUp<HTMLParagraphElement>(value);
  return (
    <div>
      <p ref={ref} className="font-display text-3xl text-primary-foreground sm:text-4xl">
        {current}
      </p>
      <p className="mt-1 text-[0.7rem] uppercase tracking-[0.1em] text-primary-foreground/70">
        {label}
      </p>
    </div>
  );
}
