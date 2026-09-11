import { useEffect, useState, type FormEvent } from "react";
import { adminUpdateFinancing } from "@/lib/site-content.server";
import type { SiteContent } from "@/lib/site-content-store.server";
import { writeDraft, clearDraft } from "@/lib/content-draft";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function FinancingContentForm({
  initial,
  onSaved,
}: {
  initial: SiteContent["financing"];
  onSaved: () => void;
}) {
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    writeDraft("financing", values);
  }, [values]);

  function set<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await adminUpdateFinancing({ data: values });
      setSaved(true);
      clearDraft();
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Bloque de financiación</h2>
        <p className="text-xs text-muted-foreground">
          Este texto aparece en la ficha de cada vehículo, debajo del botón de consultar por
          WhatsApp.
        </p>
        <div className="space-y-2">
          <Label>Título</Label>
          <Input value={values.title} onChange={(e) => set("title", e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Texto</Label>
          <RichTextEditor value={values.text} onChange={(html) => set("text", html)} />
        </div>
      </section>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {saved ? <p className="text-sm text-camel">Guardado.</p> : null}

      <Button type="submit" disabled={saving}>
        {saving ? "Guardando…" : "Guardar cambios"}
      </Button>
    </form>
  );
}
