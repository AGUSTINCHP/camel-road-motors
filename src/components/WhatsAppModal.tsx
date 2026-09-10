import { useEffect, useState } from "react";
import { whatsappUrl } from "@/lib/whatsapp";

export type WhatsAppContext = {
  title: string;
  subject: string;
  /** Vehículo precargado y editable. */
  vehicle?: string;
};

export function WhatsAppModal({
  open,
  onClose,
  context,
}: {
  open: boolean;
  onClose: () => void;
  context: WhatsAppContext;
}) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [zona, setZona] = useState("");
  const [vehiculo, setVehiculo] = useState(context.vehicle ?? "");

  useEffect(() => {
    if (open) setVehiculo(context.vehicle ?? "");
  }, [open, context.vehicle]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = [
      `Hola Suzuki Motors, soy ${nombre} ${apellido} de ${zona}.`,
      "",
      context.subject,
      vehiculo ? `Vehículo de interés: ${vehiculo}.` : "",
    ]
      .filter(Boolean)
      .join("\n");
    window.open(whatsappUrl(message.slice(0, 900)), "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center overflow-y-auto bg-ink/60 p-0 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="w-full max-w-md bg-card p-6 shadow-2xl sm:p-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
          <div className="min-w-0">
            <p className="eyebrow text-camel">Consulta directa</p>
            <h3 className="mt-2 text-2xl">{context.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="shrink-0 text-2xl leading-none text-muted-foreground transition hover:text-foreground"
          >
            ×
          </button>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Dejanos tus datos y abrimos WhatsApp con el mensaje listo para enviar.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre" value={nombre} onChange={setNombre} />
            <Field label="Apellido" value={apellido} onChange={setApellido} />
          </div>
          <Field label="Zona o localidad" value={zona} onChange={setZona} />
          <Field
            label="Qué vehículo buscás"
            value={vehiculo}
            onChange={setVehiculo}
            required={false}
            placeholder="Ej: Toyota Hilux 4x4"
          />
          <button
            type="submit"
            className="w-full bg-ink px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground transition hover:bg-camel"
          >
            Abrir WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required = true,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow text-muted-foreground">{label}</span>
      <input
        required={required}
        maxLength={120}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border-b border-border bg-transparent pb-2 text-base outline-none transition placeholder:text-muted-foreground/60 focus:border-camel"
      />
    </label>
  );
}
