import { useEffect, useState, type FormEvent } from "react";
import { adminUpdateContact } from "@/lib/site-content.server";
import type { SiteContent } from "@/lib/site-content-store.server";
import { writeDraft, clearDraft } from "@/lib/content-draft";
import { RepeatableList } from "@/components/admin/RepeatableList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ContactForm({
  initial,
  onSaved,
}: {
  initial: SiteContent["contact"];
  onSaved: () => void;
}) {
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    writeDraft("contact", values);
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
      await adminUpdateContact({ data: values });
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
        <h2 className="text-lg font-semibold">WhatsApp</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Número (solo dígitos, con código de país)</Label>
            <Input
              value={values.whatsappNumber}
              onChange={(e) => set("whatsappNumber", e.target.value)}
              placeholder="5491136034046"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Cómo se muestra en el sitio</Label>
            <Input
              value={values.whatsappDisplay}
              onChange={(e) => set("whatsappDisplay", e.target.value)}
              placeholder="+54 9 11 3603-4046"
              required
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Horario de atención</Label>
            <Input value={values.hours} onChange={(e) => set("hours", e.target.value)} required />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Redes sociales</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Instagram (URL completa)</Label>
            <Input value={values.instagramUrl} onChange={(e) => set("instagramUrl", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Facebook (URL completa)</Label>
            <Input value={values.facebookUrl} onChange={(e) => set("facebookUrl", e.target.value)} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Zonas de cobertura</h2>
        <p className="text-xs text-muted-foreground">
          Aparecen en el footer y en la sección "Dónde está el stock" del home.
        </p>
        <RepeatableList
          items={values.zones}
          onChange={(zones) => set("zones", zones)}
          newItem={() => ({ title: "Zona nueva", text: "" })}
          addLabel="Agregar zona"
          renderItem={(zone, update) => (
            <>
              <div className="space-y-2">
                <Label>Nombre de la zona</Label>
                <Input value={zone.title} onChange={(e) => update({ title: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Detalle (qué se ve ahí)</Label>
                <Input value={zone.text} onChange={(e) => update({ text: e.target.value })} />
              </div>
            </>
          )}
        />
      </section>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {saved ? <p className="text-sm text-camel">Guardado.</p> : null}

      <Button type="submit" disabled={saving}>
        {saving ? "Guardando…" : "Guardar cambios"}
      </Button>
    </form>
  );
}
