import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { SiteContent } from "@/lib/site-content-store.server";
import { readDraft } from "@/lib/content-draft";

const SiteContentContext = createContext<SiteContent | null>(null);

/**
 * ?draft=1 activa la vista previa en vivo: la página, en vez de mostrar
 * siempre el contenido guardado, superpone el borrador que esté escribiendo
 * el panel de admin en ese mismo navegador (ver content-draft.ts). Fuera de
 * ese modo el contenido es siempre el guardado — un visitante común nunca
 * pasa por acá.
 */
export function SiteContentProvider({
  value,
  children,
}: {
  value: SiteContent;
  children: ReactNode;
}) {
  const [content, setContent] = useState(value);

  useEffect(() => {
    setContent(value);
  }, [value]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("draft") !== "1") return;

    function applyDraft() {
      const draft = readDraft();
      if (!draft) return;
      setContent((prev) => ({ ...prev, [draft.section]: draft.value }));
    }

    applyDraft();
    window.addEventListener("storage", applyDraft);
    window.addEventListener("suzuki-draft-updated", applyDraft);
    return () => {
      window.removeEventListener("storage", applyDraft);
      window.removeEventListener("suzuki-draft-updated", applyDraft);
    };
  }, []);

  return <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>;
}

/** El contenido editable del sitio (textos de Home, Gestoría, Seguros, etc.), cargado una sola vez en el layout raíz. */
export function useSiteContent(): SiteContent {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    throw new Error("useSiteContent debe usarse dentro de <SiteContentProvider>");
  }
  return ctx;
}
