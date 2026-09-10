import { useState } from "react";

export function NewsletterForm() {
  const [value, setValue] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p className="mt-5 text-sm text-camel">
        ¡Listo! Te avisamos cuando entre stock nuevo.
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
      className="mt-5"
    >
      <label className="block">
        <span className="text-sm text-primary-foreground/70">
          Email o WhatsApp para enterarte del stock nuevo
        </span>
        <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto]">
          <input
            required
            maxLength={120}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="tu@email.com"
            className="min-w-0 border-b border-primary-foreground/30 bg-transparent pb-2 text-sm outline-none placeholder:text-primary-foreground/40 focus:border-camel"
          />
          <button
            type="submit"
            className="shrink-0 border-b border-camel px-4 pb-2 text-xs font-semibold uppercase tracking-[0.16em] text-camel"
          >
            Sumarme
          </button>
        </div>
      </label>
    </form>
  );
}
