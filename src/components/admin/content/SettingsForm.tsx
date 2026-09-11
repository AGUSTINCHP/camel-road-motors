import { useState, type FormEvent } from "react";
import { adminUpdateSettings } from "@/lib/site-content.server";
import type { SiteContent } from "@/lib/site-content-store.server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SettingsForm({
  initial,
  onSaved,
}: {
  initial: SiteContent["settings"];
  onSaved: () => void;
}) {
  const [arsPerUsd, setArsPerUsd] = useState(initial.arsPerUsd);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await adminUpdateSettings({ data: { arsPerUsd } });
      setSaved(true);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-10">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold">Tipo de cambio de referencia</h2>
        <p className="text-sm text-muted-foreground">
          Cuántos pesos equivalen a 1 dólar. No se le muestra al comprador en ningún lado — se usa
          solo para que el filtro de precio del catálogo funcione bien cuando hay vehículos
          publicados en dólares y en pesos al mismo tiempo. Actualizalo cada vez que el dólar se
          mueva bastante.
        </p>
        <div className="max-w-xs space-y-2">
          <Label>Pesos por dólar (ARS = 1 USD)</Label>
          <Input
            type="number"
            min={1}
            value={arsPerUsd}
            onChange={(e) => {
              setArsPerUsd(Number(e.target.value));
              setSaved(false);
            }}
            required
          />
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {saved ? <p className="text-sm text-camel">Guardado.</p> : null}

        <Button type="submit" disabled={saving}>
          {saving ? "Guardando…" : "Guardar cambios"}
        </Button>
      </form>

      <div className="border-t border-border pt-6">
        <h2 className="text-lg font-semibold">Contraseña del panel</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Por seguridad, la contraseña de <code>/admin</code> no se edita desde acá: se define en
          el servidor con la variable de entorno <code>ADMIN_PASSWORD</code> (si no se configura,
          se usa una contraseña de desarrollo). Pedile a quien tenga acceso al servidor que la
          cambie ahí.
        </p>
      </div>
    </div>
  );
}
