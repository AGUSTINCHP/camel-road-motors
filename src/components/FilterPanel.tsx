import { TYPE_LABEL, type VehicleType } from "@/data/vehicles";
import { formatKm, formatPrice } from "@/lib/format";

export type Filters = {
  type: VehicleType | "todos";
  brand: string;
  model: string;
  maxPrice: number;
  maxKm: number;
  minYear: number;
};

export function FilterPanel({
  filters,
  setFilters,
  brands,
  models,
  bounds,
  onReset,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  brands: string[];
  models: string[];
  bounds: { price: [number, number]; km: [number, number]; year: [number, number] };
  onReset: () => void;
}) {
  const types: (VehicleType | "todos")[] = [
    "todos",
    "auto",
    "camioneta",
    "moto",
    "cuatriciclo",
    "lancha",
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow text-camel">Tipo</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {types.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilters({ ...filters, type: t, brand: "", model: "" })}
              className={
                "border px-4 py-2 text-xs uppercase tracking-[0.12em] transition " +
                (filters.type === t
                  ? "border-camel bg-camel text-accent-foreground"
                  : "border-border hover:border-camel")
              }
            >
              {t === "todos" ? "Todos" : TYPE_LABEL[t]}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="eyebrow text-camel">Marca</span>
        <select
          value={filters.brand}
          onChange={(e) => setFilters({ ...filters, brand: e.target.value, model: "" })}
          className="mt-3 w-full border border-border bg-card px-3 py-3 text-sm outline-none focus:border-camel"
        >
          <option value="">Todas las marcas</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="eyebrow text-camel">Modelo</span>
        <select
          value={filters.model}
          onChange={(e) => setFilters({ ...filters, model: e.target.value })}
          className="mt-3 w-full border border-border bg-card px-3 py-3 text-sm outline-none focus:border-camel"
        >
          <option value="">Todos los modelos</option>
          {models.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </label>

      <div>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
          <span className="eyebrow min-w-0 text-camel">Precio hasta (ref. en USD)</span>
          <span className="shrink-0 text-sm">{formatPrice(filters.maxPrice)}</span>
        </div>
        <input
          type="range"
          min={bounds.price[0]}
          max={bounds.price[1]}
          step={500}
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
          className="range-camel mt-4"
          aria-label="Precio máximo"
        />
      </div>

      <div>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
          <span className="eyebrow min-w-0 text-camel">Kilometraje hasta</span>
          <span className="shrink-0 text-sm">{formatKm(filters.maxKm)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={bounds.km[1]}
          step={1000}
          value={filters.maxKm}
          onChange={(e) => setFilters({ ...filters, maxKm: Number(e.target.value) })}
          className="range-camel mt-4"
          aria-label="Kilometraje máximo"
        />
      </div>

      <div>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
          <span className="eyebrow min-w-0 text-camel">Año desde</span>
          <span className="shrink-0 text-sm">{filters.minYear}</span>
        </div>
        <input
          type="range"
          min={bounds.year[0]}
          max={bounds.year[1]}
          step={1}
          value={filters.minYear}
          onChange={(e) => setFilters({ ...filters, minYear: Number(e.target.value) })}
          className="range-camel mt-4"
          aria-label="Año mínimo"
        />
      </div>

      <button
        type="button"
        onClick={onReset}
        className="w-full border border-border py-3 text-xs uppercase tracking-[0.16em] transition hover:border-camel hover:text-camel"
      >
        Limpiar filtros
      </button>
    </div>
  );
}
