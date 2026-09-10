import { Link } from "@tanstack/react-router";
import { vehicles } from "@/data/vehicles";

const featuredBrands = [
  "Toyota",
  "Volkswagen",
  "Ford",
  "Chevrolet",
  "Renault",
  "Peugeot",
  "Fiat",
  "Honda",
  "Yamaha",
  "Jeep",
  "Suzuki",
  "Can-Am",
];

export function BrandsGrid() {
  const counts = vehicles.reduce<Record<string, number>>((acc, v) => {
    acc[v.brand] = (acc[v.brand] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
      <p className="eyebrow text-camel">Marcas que manejamos</p>
      <h2 className="mt-3 text-3xl sm:text-4xl">Elegí por marca</h2>

      <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden border border-border bg-border sm:grid-cols-3 lg:grid-cols-6">
        {featuredBrands.map((brand) => (
          <Link
            key={brand}
            to="/catalogo"
            search={{ marca: brand }}
            className="group flex flex-col items-center justify-center gap-2 bg-card px-4 py-8 transition hover:bg-camel-soft/50"
          >
            <span className="font-display text-lg tracking-[0.14em] transition group-hover:text-camel">
              {brand.toUpperCase()}
            </span>
            <span className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
              {counts[brand] ?? 0} unidades
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
