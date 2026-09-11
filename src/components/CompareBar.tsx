import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchVehiclesByIds } from "@/lib/vehicles.server";
import { formatKm, formatMoney } from "@/lib/format";
import { useCompare } from "@/lib/compare";

export function CompareBar() {
  const compare = useCompare();
  const [open, setOpen] = useState(false);
  const ids = compare.selected;

  const { data } = useQuery({
    queryKey: ["compare-vehicles", ids],
    queryFn: () => fetchVehiclesByIds({ data: ids }),
    enabled: ids.length > 0,
  });
  const items = data ?? [];

  if (ids.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-[65] border-t border-border bg-card px-5 py-3 shadow-2xl">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <p className="min-w-0 truncate text-sm">
            <span className="eyebrow text-camel">Comparador</span>{" "}
            <span className="text-muted-foreground">
              {ids.length} de 3
              {items.length > 0 ? ` · ${items.map((v) => `${v.brand} ${v.model}`).join(" / ")}` : ""}
            </span>
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={compare.clear}
              className="px-3 py-2 text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
            >
              Vaciar
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="bg-ink px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary-foreground transition hover:bg-camel"
            >
              Comparar
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[75] overflow-y-auto bg-ink/70 p-0 backdrop-blur-sm sm:p-6">
          <div className="mx-auto w-full max-w-5xl bg-card p-5 sm:p-8">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
              <h3 className="min-w-0 text-2xl">Comparativa</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="shrink-0 text-2xl leading-none text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((v) => (
                <div key={v.id} className="border border-border">
                  <img
                    src={v.images[0]}
                    alt={`${v.brand} ${v.model}`}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="space-y-3 p-4 text-sm">
                    <p className="font-display text-lg">
                      {v.brand} {v.model}
                    </p>
                    <Row label="Precio" value={formatMoney(v.price, v.currency)} />
                    <Row label="Año" value={String(v.year)} />
                    <Row label="Kilómetros" value={formatKm(v.km)} />
                    <Row label="Motor" value={v.engine} />
                    <Row label="Transmisión" value={v.transmission} />
                    <Row label="Combustible" value={v.fuel} />
                    <Link
                      to="/catalogo/$slug"
                      params={{ slug: v.slug }}
                      onClick={() => setOpen(false)}
                      className="block pt-2 text-xs font-semibold uppercase tracking-[0.16em] text-camel"
                    >
                      Ver ficha
                    </Link>
                    <button
                      type="button"
                      onClick={() => compare.remove(v.id)}
                      className="text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-border/70 pb-2">
      <span className="min-w-0 text-muted-foreground">{label}</span>
      <span className="shrink-0 text-right">{value}</span>
    </div>
  );
}
