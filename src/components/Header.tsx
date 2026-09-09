import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Wordmark } from "@/components/Wordmark";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/gestoria", label: "Gestoría" },
  { to: "/seguros", label: "Seguros" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[60] border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 lg:px-8">
        <Link to="/" className="min-w-0" onClick={() => setOpen(false)}>
          <Wordmark tagline={false} />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "text-camel" }}
              className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/70 transition hover:text-camel"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/catalogo"
            className="bg-ink px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary-foreground transition hover:bg-camel"
          >
            Ver unidades
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Menú"
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-border bg-background px-5 pb-6 pt-2 md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block border-b border-border/60 py-4 font-display text-xl"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
