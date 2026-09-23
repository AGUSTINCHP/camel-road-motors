import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonios } from "@/data/testimonials";

export function Testimonials() {
  const [i, setI] = useState(0);
  const t = testimonios[i]!;

  return (
    <section className="bg-ink text-primary-foreground">
      <div className="mx-auto max-w-4xl px-5 py-20 lg:px-8">
        <p className="eyebrow text-primary-foreground/70">Testimonios</p>
        <Quote className="mt-6 h-8 w-8 text-primary-foreground/80" />
        <blockquote
          key={i}
          className="mt-6 animate-in fade-in slide-in-from-bottom-2 font-display text-2xl leading-snug duration-500 sm:text-3xl"
        >
          {t.text}
        </blockquote>
        <p key={`${i}-meta`} className="mt-6 animate-in fade-in text-sm text-primary-foreground/60 duration-500">
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
                  (idx === i ? "bg-primary-foreground" : "bg-primary-foreground/25")
                }
              />
            ))}
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              aria-label="Anterior"
              onClick={() => setI((v) => (v - 1 + testimonios.length) % testimonios.length)}
              className="border border-primary-foreground/25 p-3 text-primary-foreground/70 transition hover:border-primary-foreground hover:text-primary-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Siguiente"
              onClick={() => setI((v) => (v + 1) % testimonios.length)}
              className="border border-primary-foreground/25 p-3 text-primary-foreground/70 transition hover:border-primary-foreground hover:text-primary-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
