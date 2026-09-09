import { useState } from "react";
import { whatsappUrl } from "@/lib/whatsapp";

export function NotifyForm({ prefill = "" }: { prefill?: string }) {
  const [nombre, setNombre] = useState("");
  const [contacto, setContacto] = useState("");
  const [busqueda, setBusqueda] = useState(prefill);
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    window.open(
      whatsappUrl(
        `Hola Suzuki Motors, soy ${nombre}. Busco: ${busqueda}. Avisenme cuando entre algo así. Mi contacto: ${contacto}.`,
      ),
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="border border-camel/40 bg-camel-soft/40 p-6 sm:p-10">
      <p className="eyebrow text-camel">No encontraste lo que buscabas</p>
      <h3 className="mt-2 text-2xl sm:text-3xl">Avisame cuando entre algo así</h3>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground">
        Contanos qué estás buscando y te escribimos apenas ingrese una unidad que coincida.
      </p>

      {sent ? (
        <p className="mt-8 font-display text-xl text-camel">
          ¡Listo! Guardamos tu búsqueda y te avisamos.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-8 grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="eyebrow text-muted-foreground">Nombre</span>
            <input
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-2 w-full border-b border-border bg-transparent pb-2 outline-none focus:border-camel"
            />
          </label>
          <label className="block">
            <span className="eyebrow text-muted-foreground">Teléfono o email</span>
            <input
              required
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
              className="mt-2 w-full border-b border-border bg-transparent pb-2 outline-none focus:border-camel"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="eyebrow text-muted-foreground">Qué estás buscando</span>
            <input
              required
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Ej: pick-up 4x4 diésel hasta USD 30.000"
              className="mt-2 w-full border-b border-border bg-transparent pb-2 outline-none placeholder:text-muted-foreground/60 focus:border-camel"
            />
          </label>
          <button
            type="submit"
            className="bg-ink px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition hover:bg-camel sm:w-fit"
          >
            Avisarme
          </button>
        </form>
      )}
    </div>
  );
}
