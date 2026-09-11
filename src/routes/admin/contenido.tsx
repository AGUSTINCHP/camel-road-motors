import { useState } from "react";
import { createFileRoute, redirect, useRouter, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { fetchAdminSession, fetchPublishedVehicles } from "@/lib/vehicles.server";
import { fetchSiteContent } from "@/lib/site-content.server";
import { ContactForm } from "@/components/admin/content/ContactForm";
import { HomeContentForm } from "@/components/admin/content/HomeContentForm";
import { GestoriaContentForm } from "@/components/admin/content/GestoriaContentForm";
import { SegurosContentForm } from "@/components/admin/content/SegurosContentForm";
import { FinancingContentForm } from "@/components/admin/content/FinancingContentForm";
import { SettingsForm } from "@/components/admin/content/SettingsForm";
import { LivePreviewFrame } from "@/components/admin/content/LivePreviewFrame";

export const Route = createFileRoute("/admin/contenido")({
  beforeLoad: async () => {
    const session = await fetchAdminSession();
    if (!session.isAdmin) throw redirect({ to: "/admin/login" });
  },
  loader: async () => {
    const [content, vehicles] = await Promise.all([fetchSiteContent(), fetchPublishedVehicles()]);
    return { content, sampleVehicleSlug: vehicles[0]?.slug ?? null };
  },
  component: AdminContenido,
});

const TABS = ["home", "gestoria", "seguros", "financiacion", "contacto", "configuracion"] as const;
type Tab = (typeof TABS)[number];

const TAB_LABEL: Record<Tab, string> = {
  home: "Home",
  gestoria: "Gestoría",
  seguros: "Seguros",
  financiacion: "Financiación",
  contacto: "Contacto",
  configuracion: "Configuración",
};

function AdminContenido() {
  const { content, sampleVehicleSlug } = Route.useLoaderData();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("home");

  const refresh = () => router.invalidate();

  // Ruta real que muestra cada sección — la vista previa es esa misma
  // página, no una recreación. Financiación vive en la ficha de un
  // vehículo cualquiera; si todavía no hay ninguno publicado no hay dónde
  // mostrarla.
  const previewPath: Record<Tab, string | null> = {
    home: "/",
    gestoria: "/gestoria",
    seguros: "/seguros",
    financiacion: sampleVehicleSlug ? `/catalogo/${sampleVehicleSlug}` : null,
    contacto: "/#cobertura",
    configuracion: null,
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-background px-6 py-5">
        <div>
          <Link to="/admin" className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Volver al stock
          </Link>
          <h1 className="mt-2 text-2xl">Contenido del sitio</h1>
        </div>
      </header>

      <div className="grid gap-8 p-6 lg:grid-cols-[200px_minmax(0,1fr)]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={
                "shrink-0 border px-4 py-2.5 text-left text-sm transition " +
                (tab === t
                  ? "border-camel bg-camel text-accent-foreground"
                  : "border-border bg-background hover:border-camel")
              }
            >
              {TAB_LABEL[t]}
            </button>
          ))}
        </nav>

        <div className="grid min-w-0 gap-8 xl:grid-cols-[440px_minmax(0,1fr)]">
          <div className="min-w-0">
            {tab === "home" ? <HomeContentForm initial={content.home} onSaved={refresh} /> : null}
            {tab === "gestoria" ? (
              <GestoriaContentForm initial={content.gestoria} onSaved={refresh} />
            ) : null}
            {tab === "seguros" ? (
              <SegurosContentForm initial={content.seguros} onSaved={refresh} />
            ) : null}
            {tab === "financiacion" ? (
              <FinancingContentForm initial={content.financing} onSaved={refresh} />
            ) : null}
            {tab === "contacto" ? <ContactForm initial={content.contact} onSaved={refresh} /> : null}
            {tab === "configuracion" ? (
              <SettingsForm initial={content.settings} onSaved={refresh} />
            ) : null}
          </div>

          {previewPath[tab] ? (
            <div className="hidden xl:block">
              <div className="sticky top-6">
                <LivePreviewFrame path={previewPath[tab]!} />
              </div>
            </div>
          ) : tab === "financiacion" ? (
            <p className="hidden text-sm text-muted-foreground xl:block">
              Todavía no hay ningún vehículo publicado para mostrar la vista previa — cargá uno
              desde "Volver al stock".
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
