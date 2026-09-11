import type { SiteContent } from "@/lib/site-content-store.server";

// Puente entre el formulario del panel y la vista previa en vivo (un iframe
// con la página real). Los dos corren en el mismo origen — el formulario en
// la pestaña de arriba, la vista previa en el iframe de abajo — así que
// localStorage es compartido entre ambos: el formulario escribe el borrador
// de la sección que se está editando, y el iframe se entera en cuanto
// cambia gracias al evento "storage" que dispara automáticamente el
// navegador entre contextos del mismo origen.
//
// Solo tiene efecto cuando la página se carga con ?draft=1 en la URL (ver
// site-content-context.tsx): un visitante común nunca activa esta ruta, y
// aunque activara el flag no tendría ningún borrador guardado en su propio
// navegador para aplicar.

const DRAFT_KEY = "suzuki-content-draft";

type Draft<K extends keyof SiteContent = keyof SiteContent> = {
  section: K;
  value: SiteContent[K];
};

export function writeDraft<K extends keyof SiteContent>(section: K, value: SiteContent[K]) {
  try {
    const draft: Draft<K> = { section, value };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    // El evento "storage" no se dispara en la misma pestaña que escribió, y
    // el formulario y la vista previa pueden convivir en la misma pestaña
    // (ej. abriendo la vista previa "en una pestaña nueva" del mismo panel)
    // — despachamos uno manual para cubrir ese caso también.
    window.dispatchEvent(new CustomEvent("suzuki-draft-updated"));
  } catch {
    /* localStorage no disponible (modo privado, etc.) — sin vista previa en vivo */
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
    window.dispatchEvent(new CustomEvent("suzuki-draft-updated"));
  } catch {
    /* ignore */
  }
}

export function readDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Draft) : null;
  } catch {
    return null;
  }
}
