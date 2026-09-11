import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, FileText, ShieldCheck } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { VehicleCard } from "@/components/VehicleCard";
import { BrandsGrid } from "@/components/BrandsGrid";
import { Testimonials } from "@/components/Testimonials";
import { CoverageZones } from "@/components/CoverageZones";
import { TradeInForm } from "@/components/TradeInForm";
import { fetchPublishedVehicles } from "@/lib/vehicles.server";
import { useSiteContent } from "@/lib/site-content-context";

export const Route = createFileRoute("/")({
  loader: async () => {
    const vehicles = await fetchPublishedVehicles();
    const featuredVehicles = vehicles.filter((v) => v.featured).slice(0, 6);
    const newestVehicles = [...vehicles]
      .sort((a, b) => a.addedDaysAgo - b.addedDaysAgo)
      .slice(0, 4);
    return { vehicles, featuredVehicles, newestVehicles };
  },
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

const PILLAR_META = [
  { icon: BadgeCheck },
  { icon: FileText, to: "/gestoria" as const },
  { icon: ShieldCheck, to: "/seguros" as const },
];

function Home() {
  const { vehicles, featuredVehicles, newestVehicles } = Route.useLoaderData();
  const { home } = useSiteContent();
  return (
    <>
      <section className="relative flex min-h-[86vh] items-end overflow-hidden">
        <img
          src={home.heroImage || heroImg}
          alt="Salón de vehículos usados de Suzuki Motors"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10" />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-32 text-primary-foreground lg:px-8">
          <p className="eyebrow text-camel">{home.heroEyebrow}</p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.05] sm:text-6xl lg:text-7xl">
            {home.heroTitle}
          </h1>
          <div
            className="prose-suzuki mt-6 max-w-lg text-base text-primary-foreground/80"
            dangerouslySetInnerHTML={{ __html: home.heroSubtitle }}
          />
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
          {home.pillars.map((p, i) => {
            const meta = PILLAR_META[i]!;
            return (
              <div key={p.title}>
                <meta.icon className="h-6 w-6 text-camel" />
                <h3 className="mt-4 text-xl">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
                {meta.to ? (
                  <Link
                    to={meta.to}
                    className="mt-4 inline-block text-xs font-semibold uppercase tracking-[0.16em] text-camel"
                  >
                    Conocer más
                  </Link>
                ) : null}
              </div>
            );
          })}
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

      <BrandsGrid vehicles={vehicles} />

      <Testimonials />

      <CoverageZones />

      <TradeInForm />

      <section className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow text-camel">Sobre nosotros</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">{home.aboutTitle}</h2>
          </div>
          <div
            className="prose-suzuki space-y-4 text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: home.aboutText }}
          />
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
