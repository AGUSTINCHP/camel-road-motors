import { useRef, useState } from "react";
import { createFileRoute, redirect, Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Download, FileSpreadsheet, Loader2 } from "lucide-react";
import { adminBulkImportVehicles, fetchAdminSession } from "@/lib/vehicles.server";
import { csvToVehicleRows, CSV_TEMPLATE, type BulkVehicleRow } from "@/lib/csv";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/vehiculos/importar")({
  beforeLoad: async () => {
    const session = await fetchAdminSession();
    if (!session.isAdmin) throw redirect({ to: "/admin/login" });
  },
  component: ImportarVehiculos,
});

function downloadTemplate() {
  const blob = new Blob([CSV_TEMPLATE], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "planilla-stock-suzuki-motors.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function ImportarVehiculos() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<BulkVehicleRow[]>([]);
  const [skipped, setSkipped] = useState(0);
  const [fileName, setFileName] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{
    created: number;
    errors: { row: number; message: string }[];
  } | null>(null);
  const [error, setError] = useState("");
  const incompleteCount = rows.filter((r) => !r.brand || !r.model).length;

  async function handleFile(file: File | null) {
    if (!file) return;
    setResult(null);
    setError("");
    setFileName(file.name);
    try {
      const text = await file.text();
      const { rows: parsed, skipped: sk } = csvToVehicleRows(text);
      setRows(parsed);
      setSkipped(sk);
    } catch {
      setError("No se pudo leer el archivo. Verificá que sea un CSV válido.");
      setRows([]);
    }
  }

  async function handleImport() {
    setImporting(true);
    setError("");
    try {
      const res = await adminBulkImportVehicles({ data: rows });
      setResult(res);
      if (res.created > 0) await router.invalidate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo importar la planilla.");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background px-6 py-5">
        <Link
          to="/admin"
          className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Volver al stock
        </Link>
        <h1 className="mt-2 text-2xl">Carga masiva por planilla</h1>
      </header>

      <div className="mx-auto max-w-3xl space-y-8 p-6">
        <section className="space-y-3 border border-border bg-background p-6">
          <h2 className="text-lg font-semibold">Cómo funciona</h2>
          <p className="text-sm text-muted-foreground">
            Subí un CSV con los datos de varios vehículos y se cargan todos de una. Como una
            planilla no puede llevar fotos, cada vehículo se crea{" "}
            <strong>en pausa (sin publicar)</strong> — entrá a cada uno después desde el stock para
            agregarle las fotos y publicarlo.
          </p>
          <p className="text-sm text-muted-foreground">
            La planilla tiene columnas separadas para <strong>precio</strong> (lo que ve el público)
            y <strong>costo</strong> (lo que pagaste vos — nunca se muestra en el sitio). Cada una
            tiene su propia columna de moneda, así que precio y costo pueden estar en pesos y
            dólares indistintamente.
          </p>
          <Button type="button" variant="outline" onClick={downloadTemplate}>
            <Download className="mr-1.5 h-4 w-4" /> Descargar planilla de ejemplo
          </Button>
        </section>

        <section className="space-y-4 border border-border bg-background p-6">
          <h2 className="text-lg font-semibold">Subir planilla</h2>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 border border-dashed border-border py-10 text-muted-foreground hover:border-camel"
          >
            <FileSpreadsheet className="h-6 w-6" />
            <span className="text-sm">{fileName || "Tocá para elegir el archivo CSV"}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          {rows.length > 0 ? (
            <>
              <p className="text-sm">
                Se leyeron <strong>{rows.length}</strong> vehículos
                {skipped > 0 ? ` (se ignoraron ${skipped} filas vacías o sin datos)` : ""}.
              </p>
              {incompleteCount > 0 ? (
                <p className="text-sm text-destructive">
                  {incompleteCount} fila(s) marcada(s) en rojo no tienen marca o modelo — se van a
                  rechazar al importar. Revisalas en la planilla antes de continuar.
                </p>
              ) : null}
              <div className="max-h-80 overflow-auto border border-border">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-muted/60 text-xs uppercase tracking-wide">
                    <tr>
                      <th className="px-3 py-2">Fila</th>
                      <th className="px-3 py-2">Marca</th>
                      <th className="px-3 py-2">Modelo</th>
                      <th className="px-3 py-2">Año</th>
                      <th className="px-3 py-2">Precio</th>
                      <th className="px-3 py-2">Costo</th>
                      <th className="px-3 py-2">Ubicación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => {
                      const incomplete = !r.brand || !r.model;
                      return (
                        <tr
                          key={i}
                          className={
                            "border-t border-border" + (incomplete ? " bg-destructive/10" : "")
                          }
                        >
                          <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                          <td className="px-3 py-2">{r.brand || "—"}</td>
                          <td className="px-3 py-2">{r.model || "—"}</td>
                          <td className="px-3 py-2">{r.year}</td>
                          <td className="px-3 py-2">
                            {r.currency} {r.price}
                          </td>
                          <td className="px-3 py-2">
                            {r.cost ? `${r.costCurrency} ${r.cost}` : "—"}
                          </td>
                          <td className="px-3 py-2">{r.location || "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <Button type="button" onClick={handleImport} disabled={importing} size="lg">
                {importing ? (
                  <>
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Importando…
                  </>
                ) : (
                  `Importar ${rows.length} vehículos`
                )}
              </Button>
            </>
          ) : null}

          {result ? (
            <div className="space-y-2 border border-camel/40 bg-camel-soft/40 p-4 text-sm">
              <p>
                <strong>{result.created}</strong> vehículos creados como borrador. Andá al stock
                para agregarles fotos y publicarlos.
              </p>
              {result.errors.length > 0 ? (
                <ul className="list-disc space-y-1 pl-5 text-destructive">
                  {result.errors.map((e) => (
                    <li key={e.row}>
                      Fila {e.row}: {e.message}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
