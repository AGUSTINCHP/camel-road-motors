import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";

const RATE_BY_TERM: Record<number, number> = { 6: 0.03, 12: 0.035, 18: 0.038, 24: 0.042 };

export function FinanceSimulator({ price }: { price: number }) {
  const [downPct, setDownPct] = useState(40);
  const [term, setTerm] = useState(12);

  const { down, financed, installment, total } = useMemo(() => {
    const down = Math.round((price * downPct) / 100);
    const financed = price - down;
    const rate = RATE_BY_TERM[term] ?? 0.035;
    const installment =
      financed === 0
        ? 0
        : (financed * rate) / (1 - Math.pow(1 + rate, -term));
    return { down, financed, installment, total: down + installment * term };
  }, [price, downPct, term]);

  return (
    <div className="border border-border bg-card p-6 sm:p-8">
      <p className="eyebrow text-camel">Simulador</p>
      <h3 className="mt-2 text-2xl">Financiación a medida</h3>

      <div className="mt-8 space-y-8">
        <div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
            <span className="min-w-0 text-sm text-muted-foreground">Anticipo ({downPct}%)</span>
            <span className="shrink-0 font-display text-lg">{formatPrice(down)}</span>
          </div>
          <input
            type="range"
            min={10}
            max={90}
            step={5}
            value={downPct}
            onChange={(e) => setDownPct(Number(e.target.value))}
            className="range-camel mt-4"
            aria-label="Anticipo"
          />
        </div>

        <div>
          <span className="text-sm text-muted-foreground">Cuotas</span>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[6, 12, 18, 24].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTerm(t)}
                className={
                  "border py-3 text-sm transition " +
                  (t === term
                    ? "border-camel bg-camel text-accent-foreground"
                    : "border-border hover:border-camel")
                }
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">Cuota estimada</p>
          <p className="mt-1 font-display text-4xl text-camel">
            {formatPrice(Math.round(installment))}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Monto a financiar {formatPrice(financed)} · Total estimado{" "}
            {formatPrice(Math.round(total))}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Valores orientativos sujetos a aprobación crediticia.
          </p>
        </div>
      </div>
    </div>
  );
}
