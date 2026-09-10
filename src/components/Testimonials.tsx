import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonios = [
  {
    text: "Compré una Hilux y me resolvieron la transferencia en menos de dos semanas. Cero vueltas, todo por WhatsApp.",
    name: "Martín G.",
    place: "Pilar",
  },
  {
    text: "Fui por una moto y terminé dejando la mía en parte de pago. Fueron muy claros con el estado de cada unidad.",
    name: "Carolina P.",
    place: "El Talar",
  },
  {
    text: "Me acompañaron con el seguro el mismo día que retiré el auto. Se nota que conocen el rubro.",
    name: "Diego R.",
    place: "Malvinas Argentinas",
  },
  {
    text: "La lancha llegó tal cual las fotos y el informe. Buena atención de principio a fin.",
    name: "Sebastián L.",
    place: "Tigre",
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  const t = testimonios[i]!;

  return (
    <section className="bg-ink text-primary-foreground">
      <div className="mx-auto max-w-4xl px-5 py-20 lg:px-8">
        <p className="eyebrow text-camel">Testimonios</p>
        <Quote className="mt-6 h-8 w-8 text-camel" />
        <blockquote className="mt-6 font-display text-2xl leading-snug sm:text-3xl">
          {t.text}
        </blockquote>
        <p className="mt-6 text-sm text-primary-foreground/60">
          {t.name} · {t.place}
        </p>

        <div className="mt-10 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="flex min-w-0 gap-2">
            {testimonios.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Testimonio ${idx + 1}`}
                onClick={() => setI(idx)}
                className={
                  "h-[2px] w-10 transition " +
                  (idx === i ? "bg-camel" : "bg-primary-foreground/25")
                }
              />
            ))}
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              aria-label="Anterior"
              onClick={() => setI((v) => (v - 1 + testimonios.length) % testimonios.length)}
              className="border border-primary-foreground/25 p-3 transition hover:border-camel hover:text-camel"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Siguiente"
              onClick={() => setI((v) => (v + 1) % testimonios.length)}
              className="border border-primary-foreground/25 p-3 transition hover:border-camel hover:text-camel"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
