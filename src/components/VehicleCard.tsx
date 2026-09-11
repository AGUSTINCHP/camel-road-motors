import { Link } from "@tanstack/react-router";
import { Scale } from "lucide-react";
import { TYPE_LABEL, type Vehicle } from "@/data/vehicles";
import { formatKm, formatMoney } from "@/lib/format";
import { useCompare } from "@/lib/compare";
import { cn } from "@/lib/utils";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const compare = useCompare();
  const selected = compare.isSelected(vehicle.id);

  return (
    <article className="group relative flex flex-col border border-border bg-card transition hover:border-camel">
      <Link
        to="/catalogo/$slug"
        params={{ slug: vehicle.slug }}
        className="relative block aspect-[4/3] overflow-hidden bg-muted"
      >
        <img
          src={vehicle.images[0]}
          alt={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
          loading="lazy"
          width={1200}
          height={800}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <span className="absolute left-0 top-0 bg-background/90 px-3 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.18em]">
          {TYPE_LABEL[vehicle.type]}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="eyebrow text-camel">{vehicle.brand}</p>
        <h3 className="mt-2 text-lg leading-snug">
          <Link to="/catalogo/$slug" params={{ slug: vehicle.slug }}>
            {vehicle.model} <span className="text-muted-foreground">{vehicle.version}</span>
          </Link>
        </h3>

        <p className="mt-3 text-sm text-muted-foreground">
          {vehicle.year} · {formatKm(vehicle.km)}
        </p>

        <div className="mt-auto grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 pt-6">
          <p className="min-w-0 font-display text-2xl">
            {formatMoney(vehicle.price, vehicle.currency)}
          </p>
          <button
            type="button"
            onClick={() => compare.toggle(vehicle.id)}
            aria-label="Agregar al comparador"
            className={cn(
              "shrink-0 border border-border p-2 transition hover:border-camel hover:text-camel",
              selected && "border-camel bg-camel text-accent-foreground",
            )}
          >
            <Scale className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
