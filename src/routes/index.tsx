import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, FileText, ShieldCheck } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { VehicleCard } from "@/components/VehicleCard";
import { BrandsGrid } from "@/components/BrandsGrid";
import { Testimonials } from "@/components/Testimonials";
import { CoverageZones } from "@/components/CoverageZones";
import { TradeInForm } from "@/components/TradeInForm";
import { featuredVehicles, newestVehicles } from "@/data/vehicles";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Suzuki Motors | Usados verificados, gestoría y seguros" },
      {
        name: "description",
        content:
          "Autos, motos, cuatriciclos y lanchas usados con verificación real. Gestoría automotor y seguros en un solo lugar.",
      },
      { property: "og:title", content: "Suzuki Motors | Usados verificados" },
      {
        property: "og:description",
        content:
          "Catálogo de autos, motos, cuatriciclos y lanchas usados. Gestoría automotor y seguros.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const pillars = [
  {
    icon: BadgeCheck,
    title: "Venta de usados",
    text: "Unidades revisadas mecánica y documentalmente antes de publicarse.",
  },
  {
    icon: FileText,
    title: "Gestoría automotor",
    text: "Transferencias de dominio, altas, bajas y formularios sin vueltas.",
    to: "/gestoria" as const,
  },
  {
    icon: ShieldCheck,
    title: "Seguros",
    text: "Coberturas para autos, motos y náutica con asesoramiento propio.",
    to: "/seguros" as const,
  },
];

function Home() {
  return (
    <>
      <section className="relative flex min-h-[86vh] items-end overflow-hidden">
        <img
          src={heroImg}
          alt="Salón de vehículos usados de Suzuki Motors"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10" />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-32 text-primary-foreground lg:px-8">
          <p className="eyebrow text-camel">Desde 2009 en San Martín</p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.05] sm:text-6xl lg:text-7xl">
            Usados elegidos uno por uno.
          </h1>
          <p className="mt-6 max-w-lg text-base text-primary-foreground/80">
            Autos, motos, cuatriciclos y lanchas verificados. Te acompañamos con la gestoría y el
            seguro para que salgas andando.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-3 bg-camel px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-accent-foreground transition hover:bg-background hover:text-ink"
            >
              Ver el catálogo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-camel-soft/40">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:grid-cols-3 lg:px-8">
          {pillars.map((p) => (
            <div key={p.title}>
              <p.icon className="h-6 w-6 text-camel" />
              <h3 className="mt-4 text-xl">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
              {p.to ? (
                <Link
                  to={p.to}
                  className="mt-4 inline-block text-xs font-semibold uppercase tracking-[0.16em] text-camel"
                >
                  Conocer más
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <Section
        eyebrow="Selección de la casa"
        title="Destacados"
        action={{ label: "Ver todo el catálogo", to: "/catalogo" }}
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredVehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      </Section>

      <Section eyebrow="Ingresos de la semana" title="Recién llegados">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {newestVehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      </Section>

      <BrandsGrid />

      <Testimonials />

      <CoverageZones />

      <TradeInForm />

      <section className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow text-camel">Sobre nosotros</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">
              Un concesionario de barrio con estándares de agencia premium.
            </h2>
          </div>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Somos una familia dedicada a la compra y venta de vehículos usados. Cada unidad pasa
              por revisión mecánica, control de service y verificación de documentación antes de
              entrar al salón.
            </p>
            <p>
              Trabajamos con toma de usados, financiación propia y acompañamiento completo en la
              transferencia y el seguro.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function Section({
  eyebrow,
  title,
  action,
  children,
}: {
  eyebrow: string;
  title: string;
  action?: { label: string; to: "/catalogo" };
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div className="min-w-0">
          <p className="eyebrow text-camel">{eyebrow}</p>
          <h2 className="mt-3 text-3xl sm:text-4xl">{title}</h2>
        </div>
        {action ? (
          <Link
            to={action.to}
            className="hidden shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-camel sm:block"
          >
            {action.label}
          </Link>
        ) : null}
      </div>
      <div className="mt-10">{children}</div>
    </section>
  );
}
