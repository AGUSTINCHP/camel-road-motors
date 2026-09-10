const zonas = [
  { name: "Pilar", note: "Autos y pick-ups" },
  { name: "El Talar / Tigre", note: "Náutica y cuatriciclos" },
  { name: "Pacheco", note: "Motos y autos compactos" },
  { name: "Malvinas Argentinas", note: "Autos y utilitarios" },
];

export function CoverageZones() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
      <p className="eyebrow text-camel">Zonas de cobertura</p>
      <h2 className="mt-3 text-3xl sm:text-4xl">Dónde está el stock</h2>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        No trabajamos con un único salón: cada unidad está en la zona donde se exhibe. La visita o
        la entrega se coordinan por WhatsApp según dónde esté el vehículo que te interesa.
      </p>

      <div className="mt-10 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {zonas.map((z) => (
          <div key={z.name} className="bg-card p-6">
            <h3 className="text-xl">{z.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{z.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
