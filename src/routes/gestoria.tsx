import { createFileRoute } from "@tanstack/react-router";
import gestoriaImg from "@/assets/gestoria.jpg";
import { WhatsAppButton } from "@/components/WhatsAppButton";

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

const servicios = [
  ["Transferencia de dominio", "Compraventa entre particulares o con agencia, con firma certificada."],
  ["Altas y bajas", "Inscripciones iniciales, bajas por desarme y cambios de radicación."],
  ["Informes y verificaciones", "Informe de dominio, histórico y verificación policial."],
  ["Duplicados y cédulas", "Cédula azul, duplicado de título y denuncia de venta."],
  ["Patentes y libre deuda", "Gestión de libre deuda de patentes e infracciones."],
  ["Prendas", "Inscripción y cancelación de prenda con entidades financieras."],
];

const pasos = [
  ["Consulta", "Nos contás el trámite por WhatsApp y te decimos qué documentación hace falta."],
  ["Documentación", "Coordinamos firmas certificadas y armamos la carpeta completa."],
  ["Presentación", "Presentamos en el registro seccional que corresponde y seguimos el estado."],
  ["Entrega", "Te entregamos título y cédulas nuevas, con todo verificado."],
];

function Gestoria() {
  return (
    <div>
      <section className="relative">
        <img
          src={gestoriaImg}
          alt="Documentación de transferencia de un vehículo"
          width={1400}
          height={900}
          className="h-[46vh] w-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/60" />
        <div className="absolute inset-0 mx-auto flex max-w-6xl flex-col justify-end px-5 pb-10 text-primary-foreground lg:px-8">
          <p className="eyebrow text-camel">Servicio</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">Gestoría automotor</h1>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <p className="max-w-2xl text-lg text-muted-foreground">
          Hacemos toda la parte administrativa de tu vehículo: transferencias, informes y trámites
          en registro seccional, con seguimiento personalizado.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {servicios.map(([title, text]) => (
            <div key={title} className="border-t border-border pt-5">
              <h2 className="text-xl">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-camel-soft/40">
        <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
          <p className="eyebrow text-camel">Cómo trabajamos</p>
          <h2 className="mt-3 text-3xl sm:text-4xl">Cuatro pasos, sin idas y vueltas</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {pasos.map(([title, text], i) => (
              <li key={title}>
                <span className="font-display text-4xl text-camel">0{i + 1}</span>
                <h3 className="mt-3 text-lg">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 text-center lg:px-8">
        <h2 className="text-3xl sm:text-4xl">¿Tenés un trámite para resolver?</h2>
        <p className="mt-3 text-muted-foreground">Contanos tu caso y te pasamos costos y plazos.</p>
        <div className="mt-8 flex justify-center">
          <WhatsAppButton
            context={{
              title: "Gestoría automotor",
              subject: "Quería consultar por un trámite de gestoría automotor.",
            }}
          >
            Consultar gestoría
          </WhatsAppButton>
        </div>
      </section>
    </div>
  );
}
