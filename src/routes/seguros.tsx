import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import segurosImg from "@/assets/seguros.jpg";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const Route = createFileRoute("/seguros")({
  head: () => ({
    meta: [
      { title: "Seguros para autos, motos y náutica | Suzuki Motors" },
      {
        name: "description",
        content:
          "Coberturas de responsabilidad civil, terceros completo y todo riesgo para autos, motos, cuatriciclos y lanchas.",
      },
      { property: "og:title", content: "Seguros | Suzuki Motors" },
      {
        property: "og:description",
        content: "Cotizamos coberturas para autos, motos, cuatriciclos y lanchas.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/seguros" },
    ],
    links: [{ rel: "canonical", href: "/seguros" }],
  }),
  component: Seguros,
});

const coberturas = [
  {
    name: "Responsabilidad civil",
    text: "La cobertura obligatoria para circular, con auxilio y remolque incluidos.",
    items: ["Responsabilidad civil ante terceros", "Auxilio mecánico", "Remolque"],
  },
  {
    name: "Terceros completo",
    text: "Suma robo, incendio y cristales a la cobertura básica.",
    items: ["Robo e incendio total", "Cristales y cerraduras", "Granizo opcional"],
  },
  {
    name: "Todo riesgo",
    text: "Máxima protección con franquicia a medida del valor del vehículo.",
    items: ["Daño parcial y total", "Robo total y parcial", "Auto sustituto"],
  },
];

const beneficios = [
  "Cotizamos en varias compañías y te mostramos la comparativa",
  "Alta inmediata al momento de retirar la unidad",
  "Asesoramiento propio ante siniestros",
  "Coberturas náuticas y para cuatriciclos",
];

function Seguros() {
  return (
    <div>
      <section className="relative">
        <img
          src={segurosImg}
          alt="Concepto de protección del vehículo"
          width={1400}
          height={900}
          className="h-[46vh] w-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/60" />
        <div className="absolute inset-0 mx-auto flex max-w-6xl flex-col justify-end px-5 pb-10 text-primary-foreground lg:px-8">
          <p className="eyebrow text-camel">Servicio</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">Seguros</h1>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <p className="max-w-2xl text-lg text-muted-foreground">
          Te ayudamos a elegir la cobertura justa para tu vehículo, sin pagar de más y con
          respaldo real cuando pasa algo.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {coberturas.map((c) => (
            <div key={c.name} className="border border-border p-6">
              <h2 className="text-2xl">{c.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{c.text}</p>
              <ul className="mt-6 space-y-3 text-sm">
                {c.items.map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-camel" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-camel-soft/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="eyebrow text-camel">Beneficios</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">Por qué asegurarte con nosotros</h2>
          </div>
          <ul className="space-y-4">
            {beneficios.map((b) => (
              <li key={b} className="flex items-start gap-3 border-b border-border pb-4">
                <Check className="mt-1 h-4 w-4 shrink-0 text-camel" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 text-center lg:px-8">
        <h2 className="text-3xl sm:text-4xl">Pedí tu cotización</h2>
        <p className="mt-3 text-muted-foreground">
          Contanos qué vehículo tenés y te pasamos opciones el mismo día.
        </p>
        <div className="mt-8 flex justify-center">
          <WhatsAppButton
            context={{
              title: "Seguros",
              subject: "Quería cotizar un seguro para mi vehículo.",
            }}
          >
            Cotizar seguro
          </WhatsAppButton>
        </div>
      </section>
    </div>
  );
}
