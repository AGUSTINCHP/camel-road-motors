import { Link } from "@tanstack/react-router";
import { Facebook, Instagram } from "lucide-react";
import { Wordmark } from "@/components/Wordmark";
import { NewsletterForm } from "@/components/NewsletterForm";
import { WHATSAPP_DISPLAY, whatsappUrl } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Wordmark />
          <p className="mt-6 max-w-xs text-sm text-primary-foreground/70">
            Compra y venta de vehículos usados con verificación real, gestoría automotor y seguros.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="border border-primary-foreground/25 p-3 transition hover:border-camel hover:text-camel"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="border border-primary-foreground/25 p-3 transition hover:border-camel hover:text-camel"
            >
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <p className="eyebrow text-camel">Navegación</p>
          <ul className="mt-5 space-y-3 text-sm text-primary-foreground/80">
            <li>
              <Link to="/catalogo" className="hover:text-camel">
                Catálogo
              </Link>
            </li>
            <li>
              <Link to="/gestoria" className="hover:text-camel">
                Gestoría automotor
              </Link>
            </li>
            <li>
              <Link to="/seguros" className="hover:text-camel">
                Seguros
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-camel">Zonas de cobertura</p>
          <ul className="mt-5 space-y-3 text-sm text-primary-foreground/80">
            <li>Pilar</li>
            <li>El Talar / Tigre</li>
            <li>Pacheco</li>
            <li>Malvinas Argentinas</li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-camel">Contacto</p>
          <ul className="mt-5 space-y-3 text-sm text-primary-foreground/80">
            <li>
              <a
                href={whatsappUrl("Hola Suzuki Motors, quería hacerles una consulta.")}
                target="_blank"
                rel="noreferrer"
                className="hover:text-camel"
              >
                {WHATSAPP_DISPLAY}
              </a>
            </li>
            <li>Lunes a sábado, 9 a 19 h</li>
          </ul>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-primary-foreground/15 px-5 py-6 text-center text-xs text-primary-foreground/50 lg:px-8">
        © {new Date().getFullYear()} Suzuki Motors. Todos los derechos reservados.
      </div>
    </footer>
  );
}
