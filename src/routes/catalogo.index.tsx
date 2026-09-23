import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SlidersHorizontal, X } from "lucide-react";
import { FilterPanel, type Filters } from "@/components/FilterPanel";
import { VehicleCard } from "@/components/VehicleCard";
import { NotifyForm } from "@/components/NotifyForm";
import { Reveal } from "@/components/Reveal";
import { TYPE_LABEL, type VehicleType } from "@/data/vehicles";
import { fetchPublishedVehicles } from "@/lib/vehicles.server";
import { fetchSiteContent } from "@/lib/site-content.server";
import { toUsdEquivalent } from "@/lib/currency";
import { useSiteContent } from "@/lib/site-content-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortOption = "relevancia" | "precio_asc" | "precio_desc" | "anio_nuevo" | "km_asc";

const SORT_LABEL: Record<SortOption, string> = {
  relevancia: "Relevancia",
  precio_asc: "Menor precio",
  precio_desc: "Mayor precio",
  anio_nuevo: "Año más nuevo",
  km_asc: "Menor kilometraje",
};

type CatalogSearch = { marca?: string; tipo?: VehicleType };

const VALID_TYPES: VehicleType[] = ["auto", "camioneta", "moto", "cuatriciclo", "lancha"];

export const Route = createFileRoute("/catalogo/")({
  validateSearch: (search: Record<string, unknown>): CatalogSearch => {
    const marca = typeof search["marca"] === "string" ? search["marca"] : undefined;
    const tipoRaw = typeof search["tipo"] === "string" ? (search["tipo"] as VehicleType) : undefined;
    const tipo = tipoRaw && VALID_TYPES.includes(tipoRaw) ? tipoRaw : undefined;
    return {
      ...(marca ? { marca } : {}),
      ...(tipo ? { tipo } : {}),
    };
  },
  loader: async () => {
    const [vehicles, { settings }] = await Promise.all([fetchPublishedVehicles(), fetchSiteContent()]);
    // El slider de precio trabaja en dólares de referencia: convertimos los
    // vehículos publicados en pesos para que entren en la misma escala.
    const usdPrices = vehicles.map((v) => toUsdEquivalent(v.price, v.currency, settings.arsPerUsd));
    const priceRange: [number, number] =
      vehicles.length > 0 ? [Math.min(...usdPrices), Math.max(...usdPrices)] : [0, 0];
    const kmRange: [number, number] = [0, Math.max(0, ...vehicles.map((v) => v.km))];
    const yearRange: [number, number] =
      vehicles.length > 0
        ? [Math.min(...vehicles.map((v) => v.year)), Math.max(...vehicles.map((v) => v.year))]
        : [2000, new Date().getFullYear()];
    return { vehicles, priceRange, kmRange, yearRange };
  },
  head: () => ({
    meta: [
      { title: "Catálogo de usados | Suzuki Motors" },
      {
        name: "description",
        content:
          "Explorá autos, motos, cuatriciclos y lanchas usados. Filtrá por tipo, marca, modelo, precio, kilometraje y año.",
      },
      { property: "og:title", content: "Catálogo de usados | Suzuki Motors" },
      {
        property: "og:description",
        content: "Decenas de unidades verificadas con filtros en tiempo real.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/catalogo" },
    ],
    links: [{ rel: "canonical", href: "/catalogo" }],
  }),
  component: Catalogo,
});

function Catalogo() {
  const { vehicles, priceRange, kmRange, yearRange } = Route.useLoaderData();
  const { settings } = useSiteContent();
  const search = Route.useSearch();
  const baseFilters: Filters = {
    type: "todos",
    brand: "",
    model: "",
    maxPrice: priceRange[1],
    maxKm: kmRange[1],
    minYear: yearRange[0],
  };
  const [filters, setFilters] = useState<Filters>({
    ...baseFilters,
    type: search.tipo ?? "todos",
    brand: search.marca ?? "",
  });
  const [drawer, setDrawer] = useState(false);
  const [sort, setSort] = useState<SortOption>("relevancia");

  useEffect(() => {
    setFilters((f) => ({ ...f, type: search.tipo ?? "todos", brand: search.marca ?? "" }));
  }, [search.tipo, search.marca]);

  const byType = useMemo(
    () => vehicles.filter((v) => filters.type === "todos" || v.type === filters.type),
    [vehicles, filters.type],
  );

  const brands = useMemo(() => Array.from(new Set(byType.map((v) => v.brand))).sort(), [byType]);

  const models = useMemo(
    () =>
      Array.from(
        new Set(
          byType.filter((v) => !filters.brand || v.brand === filters.brand).map((v) => v.model),
        ),
      ).sort(),
    [byType, filters.brand],
  );

  const results = useMemo(() => {
    const filtered = byType.filter(
      (v) =>
        (!filters.brand || v.brand === filters.brand) &&
        (!filters.model || v.model === filters.model) &&
        toUsdEquivalent(v.price, v.currency, settings.arsPerUsd) <= filters.maxPrice &&
        v.km <= filters.maxKm &&
        v.year >= filters.minYear,
    );
    const withUsd = filtered.map((v) => ({
      v,
      usd: toUsdEquivalent(v.price, v.currency, settings.arsPerUsd),
    }));
    switch (sort) {
      case "precio_asc":
        withUsd.sort((a, b) => a.usd - b.usd);
        break;
      case "precio_desc":
        withUsd.sort((a, b) => b.usd - a.usd);
        break;
      case "anio_nuevo":
        withUsd.sort((a, b) => b.v.year - a.v.year);
        break;
      case "km_asc":
        withUsd.sort((a, b) => a.v.km - b.v.km);
        break;
      default:
        break;
    }
    return withUsd.map((x) => x.v);
  }, [byType, filters, settings.arsPerUsd, sort]);

  const activeChips: { label: string; onRemove: () => void }[] = [
    ...(filters.type !== "todos"
      ? [{ label: TYPE_LABEL[filters.type], onRemove: () => setFilters({ ...filters, type: "todos" }) }]
      : []),
    ...(filters.brand
      ? [{ label: filters.brand, onRemove: () => setFilters({ ...filters, brand: "", model: "" }) }]
      : []),
    ...(filters.model
      ? [{ label: filters.model, onRemove: () => setFilters({ ...filters, model: "" }) }]
      : []),
  ];

  const panel = (
    <FilterPanel
      filters={filters}
      setFilters={setFilters}
      brands={brands}
      models={models}
      bounds={{ price: priceRange, km: kmRange, year: yearRange }}
      onReset={() => setFilters(baseFilters)}
    />
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
      <p className="eyebrow text-camel">Stock disponible</p>
      <h1 className="mt-3 text-4xl sm:text-5xl">Catálogo</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        {results.length} unidades verificadas listas para transferir.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-28">{panel}</div>
        </aside>

        <div>
          <button
            type="button"
            onClick={() => setDrawer(true)}
            className="mb-6 flex w-full items-center justify-center gap-2 border border-border py-3 text-xs uppercase tracking-[0.16em] lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filtrar
          </button>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {activeChips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={chip.onRemove}
                  className="flex items-center gap-1.5 border border-camel bg-camel-soft/40 px-3 py-1.5 text-xs uppercase tracking-[0.1em] text-ink transition hover:border-destructive hover:text-destructive"
                >
                  {chip.label} <X className="h-3 w-3" />
                </button>
              ))}
            </div>
            <label className="ml-auto flex shrink-0 items-center gap-2">
              <span className="eyebrow text-muted-foreground">Ordenar por</span>
              <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(SORT_LABEL) as SortOption[]).map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {SORT_LABEL[opt]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          </div>

          {results.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((v, i) => (
                <Reveal key={v.id} delay={(i % 6) * 60}>
                  <VehicleCard vehicle={v} />
                </Reveal>
              ))}
            </div>
          ) : (
            <NotifyForm
              prefill={[filters.type !== "todos" ? filters.type : "", filters.brand, filters.model]
                .filter(Boolean)
                .join(" ")}
            />
          )}

          {results.length > 0 ? (
            <div className="mt-16">
              <NotifyForm />
            </div>
          ) : null}
        </div>
      </div>

      {drawer ? (
        <div className="fixed inset-0 z-[75] flex bg-ink/60 backdrop-blur-sm lg:hidden">
          <div className="ml-auto h-full w-[88%] max-w-sm overflow-y-auto bg-card p-6">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
              <h2 className="min-w-0 text-2xl">Filtros</h2>
              <button
                type="button"
                onClick={() => setDrawer(false)}
                aria-label="Cerrar filtros"
                className="shrink-0"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-8">{panel}</div>
            <button
              type="button"
              onClick={() => setDrawer(false)}
              className="mt-8 w-full bg-ink py-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground"
            >
              Ver {results.length} resultados
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
