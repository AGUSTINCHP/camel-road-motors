import { useState } from "react";
import { whatsappUrl } from "@/lib/whatsapp";

export function TradeInForm() {
  const [form, setForm] = useState({
    nombre: "",
    marca: "",
    modelo: "",
    anio: "",
    km: "",
    estado: "Muy bueno",
    zona: "",
  });

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = [
      `Hola Suzuki Motors, soy ${form.nombre} de ${form.zona}.`,
      "Quiero entregar mi usado en parte de pago:",
      `${form.marca} ${form.modelo} ${form.anio} · ${form.km} km · estado ${form.estado}.`,
      "¿Lo pueden evaluar?",
    ].join("\n");
    window.open(whatsappUrl(msg), "_blank", "noopener,noreferrer");
  };

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
      <div className="grid gap-10 border border-border bg-card p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-start">
        <div>
          <p className="eyebrow text-camel">Parte de pago</p>
          <h2 className="mt-3 text-3xl sm:text-4xl">Tomamos tu usado</h2>
          <p className="mt-4 text-muted-foreground">
            Contanos qué tenés y lo evaluamos nosotros, sin tasaciones automáticas. Te pasamos una
            propuesta después de verlo o de recibir fotos por WhatsApp.
          </p>
        </div>

        <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
          <Field label="Nombre" value={form.nombre} onChange={set("nombre")} />
          <Field label="Zona" value={form.zona} onChange={set("zona")} />
          <Field label="Marca" value={form.marca} onChange={set("marca")} />
          <Field label="Modelo" value={form.modelo} onChange={set("modelo")} />
          <Field label="Año" value={form.anio} onChange={set("anio")} inputMode="numeric" />
          <Field label="Kilometraje" value={form.km} onChange={set("km")} inputMode="numeric" />
          <label className="block sm:col-span-2">
            <span className="eyebrow text-muted-foreground">Estado general</span>
            <select
              value={form.estado}
              onChange={(e) => set("estado")(e.target.value)}
              className="mt-2 w-full border border-border bg-card px-3 py-3 text-sm outline-none focus:border-camel"
            >
              {["Excelente", "Muy bueno", "Bueno", "A reparar"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="bg-ink px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition hover:bg-camel sm:col-span-2"
          >
            Enviar para evaluar
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  inputMode?: "numeric";
}) {
  return (
    <label className="block">
      <span className="eyebrow text-muted-foreground">{label}</span>
      <input
        required
        maxLength={60}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border-b border-border bg-transparent pb-2 outline-none focus:border-camel"
      />
    </label>
  );
}
