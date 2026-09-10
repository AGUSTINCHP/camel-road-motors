import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, Heart } from "lucide-react";
import { FinanceSimulator } from "@/components/FinanceSimulator";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { NotifyForm } from "@/components/NotifyForm";
import { getVehicleBySlug, TYPE_LABEL } from "@/data/vehicles";
import { formatKm, formatPrice } from "@/lib/format";
import { useCompare } from "@/lib/compare";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/catalogo/$slug")({
  loader: ({ params }) => {
    const vehicle = getVehicleBySlug(params.slug);
    if (!vehicle) throw notFound();
    return { vehicle };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Vehículo no disponible | Suzuki Motors" }, { name: "robots", content: "noindex" }],
      };
    }
    const v = loaderData.vehicle;
    const title = `${v.brand} ${v.model} ${v.version} ${v.year} | Suzuki Motors`;
    const description = `${TYPE_LABEL[v.type]} ${v.brand} ${v.model} ${v.year} con ${formatKm(
      v.km,
    )} en ${formatPrice(v.price)}. Verificado y listo para transferir.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/catalogo/${v.slug}` },
      ],
      links: [{ rel: "canonical", href: `/catalogo/${v.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Vehicle",
            name: `${v.brand} ${v.model} ${v.version}`,
            brand: v.brand,
            modelDate: v.year,
            mileageFromOdometer: { "@type": "QuantitativeValue", value: v.km, unitCode: "KMT" },
            offers: { "@type": "Offer", price: v.price, priceCurrency: "USD" },
          }),
        },
      ],
    };
  },
  component: VehicleDetail,
});

function VehicleDetail() {
  const { vehicle } = Route.useLoaderData();
  const [active, setActive] = useState(0);
  const compare = useCompare();
  const selected = compare.isSelected(vehicle.id);

  const specs: [string, string][] = [
    ["Tipo", TYPE_LABEL[vehicle.type]],
    ["Marca", vehicle.brand],
    ["Modelo", `${vehicle.model} ${vehicle.version}`],
    ["Año", String(vehicle.year)],
    ["Kilometraje", formatKm(vehicle.km)],
    ["Motor", vehicle.engine],
    ["Transmisión", vehicle.transmission],
    ["Combustible", vehicle.fuel],
    ["Color", vehicle.color],
    ["Ubicación", vehicle.location],
    ...(vehicle.doors ? ([["Puertas", String(vehicle.doors)]] as [string, string][]) : []),
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <Link to="/catalogo" className="eyebrow text-camel">
        ← Volver al catálogo
      </Link>

      <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div>
          <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
            <img
              src={vehicle.images[active]}
              alt={`${vehicle.brand} ${vehicle.model} ${vehicle.year}`}
              width={1200}
              height={800}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-3 flex gap-3">
            {vehicle.images.map((img, i) => (
              <button
                key={img + i}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "h-20 w-28 overflow-hidden border transition",
                  i === active ? "border-camel" : "border-border opacity-70 hover:opacity-100",
                )}
              >
                <img src={img} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          <div className="mt-10 border border-camel/40 bg-camel-soft/40 p-6">
            <p className="eyebrow text-camel">Vehículo verificado</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {vehicle.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-camel" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl">Ficha técnica</h2>
            <dl className="mt-6 grid gap-x-10 sm:grid-cols-2">
              {specs.map(([k, val]) => (
                <div
                  key={k}
                  className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-border py-3 text-sm"
                >
                  <dt className="min-w-0 text-muted-foreground">{k}</dt>
                  <dd className="shrink-0 text-right">{val}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow text-camel">{vehicle.brand}</p>
          <h1 className="mt-3 text-3xl sm:text-4xl">
            {vehicle.model} <span className="text-muted-foreground">{vehicle.version}</span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            {vehicle.year} · {formatKm(vehicle.km)} · {vehicle.location}
          </p>
          <p className="mt-6 font-display text-4xl">{formatPrice(vehicle.price)}</p>

          <div className="mt-8 space-y-3">
            <WhatsAppButton
              className="w-full"
              context={{
                title: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
                vehicle: `${vehicle.brand} ${vehicle.model} ${vehicle.version} ${vehicle.year}`,
                subject: `Me interesa el ${vehicle.brand} ${vehicle.model} ${vehicle.version} ${vehicle.year} (${formatKm(
                  vehicle.km,
                )}) publicado en ${formatPrice(vehicle.price)}.`,
              }}
            />
            <button
              type="button"
              onClick={() => compare.toggle(vehicle.id)}
              className={cn(
                "flex w-full items-center justify-center gap-2 border border-border px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] transition hover:border-camel hover:text-camel",
                selected && "border-camel bg-camel text-accent-foreground",
              )}
            >
              <Heart className={cn("h-4 w-4", selected && "fill-current")} />
              {selected ? "Guardado para comparar" : "Guardar y comparar (hasta 3)"}
            </button>
          </div>

          <div className="mt-8">
            <FinanceSimulator price={vehicle.price} />
          </div>
        </div>
      </div>

      <div className="mt-20">
        <NotifyForm prefill={`Algo similar a ${vehicle.brand} ${vehicle.model}`} />
      </div>
    </div>
  );
}
