import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SlidersHorizontal, X } from "lucide-react";
import { FilterPanel, type Filters } from "@/components/FilterPanel";
import { VehicleCard } from "@/components/VehicleCard";
import { NotifyForm } from "@/components/NotifyForm";
import { type VehicleType } from "@/data/vehicles";
import { fetchPublishedVehicles } from "@/lib/vehicles.server";

type CatalogSearch = { marca?: string; tipo?: VehicleType };

const VALID_TYPES: VehicleType[] = ["auto", "moto", "cuatriciclo", "lancha"];

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
    const vehicles = await fetchPublishedVehicles();
    const priceRange: [number, number] =
      vehicles.length > 0
        ? [Math.min(...vehicles.map((v) => v.price)), Math.max(...vehicles.map((v) => v.price))]
        : [0, 0];
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

  const results = useMemo(
    () =>
      byType.filter(
        (v) =>
          (!filters.brand || v.brand === filters.brand) &&
          (!filters.model || v.model === filters.model) &&
          v.price <= filters.maxPrice &&
          v.km <= filters.maxKm &&
          v.year >= filters.minYear,
      ),
    [byType, filters],
  );

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

          {results.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
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
