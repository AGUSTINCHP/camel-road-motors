import { useState } from "react";
import { ExternalLink, RefreshCw } from "lucide-react";

/**
 * Vista previa en vivo: un iframe con la página real del sitio, en modo
 * borrador (?draft=1 — ver site-content-context.tsx). No es una maqueta,
 * es la misma página que ve cualquier visitante, mostrando lo que estás
 * escribiendo en el formulario de al lado antes de guardar.
 */
export function LivePreviewFrame({ path }: { path: string }) {
  const [loaded, setLoaded] = useState(false);
  // El query string tiene que ir antes del fragment (#ancla), no después.
  const [base, hash] = path.split("#");
  const draftUrl = `${base}?draft=1${hash ? `#${hash}` : ""}`;

  return (
    <div className="flex h-full flex-col border border-border bg-background">
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Vista previa en vivo — {path === "/" ? "Home" : path}
        </p>
        <div className="flex items-center gap-3">
          <a
            href={draftUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Abrir
          </a>
        </div>
      </div>
      <div className="relative flex-1">
        {!loaded ? (
          <div className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" /> Cargando…
          </div>
        ) : null}
        <iframe
          key={path}
          src={draftUrl}
          title="Vista previa"
          onLoad={() => setLoaded(true)}
          className="h-full w-full"
          style={{ minHeight: "780px" }}
        />
      </div>
    </div>
  );
}
