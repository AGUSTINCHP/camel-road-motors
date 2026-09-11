import { createFileRoute } from "@tanstack/react-router";
import gestoriaImg from "@/assets/gestoria.jpg";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useSiteContent } from "@/lib/site-content-context";

export const Route = createFileRoute("/gestoria")({
  head: () => ({
    meta: [
      { title: "Gestoría automotor | Suzuki Motors" },
      {
        name: "description",
        content:
          "Transferencias de dominio, altas, bajas, informes y formularios. Gestoría automotor completa en San Martín, Buenos Aires.",
      },
      { property: "og:title", content: "Gestoría automotor | Suzuki Motors" },
      {
        property: "og:description",
        content: "Transferencias de dominio y trámites del automotor sin vueltas.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/gestoria" },
    ],
    links: [{ rel: "canonical", href: "/gestoria" }],
  }),
  component: Gestoria,
});

function Gestoria() {
  const { gestoria } = useSiteContent();
  return (
    <div>
      <section className="relative">
        <img
          src={gestoria.heroImage || gestoriaImg}
          alt="Documentación de transferencia de un vehículo"
          width={1400}
          height={900}
          className="h-[46vh] w-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/60" />
        <div className="absolute inset-0 mx-auto flex max-w-6xl flex-col justify-end px-5 pb-10 text-primary-foreground lg:px-8">
          <p className="eyebrow text-camel">Servicio</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">{gestoria.heroTitle}</h1>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <div
          className="prose-suzuki max-w-2xl text-lg text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: gestoria.intro }}
        />

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {gestoria.servicios.map((s) => (
            <div key={s.title} className="border-t border-border pt-5">
              <h2 className="text-xl">{s.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-camel-soft/40">
        <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
          <p className="eyebrow text-camel">Cómo trabajamos</p>
          <h2 className="mt-3 text-3xl sm:text-4xl">Cuatro pasos, sin idas y vueltas</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {gestoria.pasos.map((p, i) => (
              <li key={p.title}>
                <span className="font-display text-4xl text-camel">0{i + 1}</span>
                <h3 className="mt-3 text-lg">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 text-center lg:px-8">
        <h2 className="text-3xl sm:text-4xl">{gestoria.ctaTitle}</h2>
        <p className="mt-3 text-muted-foreground">{gestoria.ctaText}</p>
        <div className="mt-8 flex justify-center">
          <WhatsAppButton
            context={{
              title: "Gestoría automotor",
              subject: gestoria.whatsappSubject,
            }}
          >
            Consultar gestoría
          </WhatsAppButton>
        </div>
      </section>
    </div>
  );
}
