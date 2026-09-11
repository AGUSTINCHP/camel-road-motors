import { useEffect, useState, type FormEvent } from "react";
import { adminUpdateGestoria } from "@/lib/site-content.server";
import type { SiteContent } from "@/lib/site-content-store.server";
import { writeDraft, clearDraft } from "@/lib/content-draft";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { RepeatableList } from "@/components/admin/RepeatableList";
import { ImageField } from "@/components/admin/content/ImageField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function GestoriaContentForm({
  initial,
  onSaved,
}: {
  initial: SiteContent["gestoria"];
  onSaved: () => void;
}) {
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    writeDraft("gestoria", values);
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
      await adminUpdateGestoria({ data: values });
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
        <h2 className="text-lg font-semibold">Encabezado</h2>
        <div className="space-y-2">
          <Label>Título</Label>
          <Input value={values.heroTitle} onChange={(e) => set("heroTitle", e.target.value)} required />
        </div>
        <ImageField
          label="Foto de portada"
          value={values.heroImage}
          onChange={(url) => set("heroImage", url)}
          hint="Horizontal, ideal 1400×900px o más ancha."
        />
        <div className="space-y-2">
          <Label>Texto de introducción</Label>
          <RichTextEditor value={values.intro} onChange={(html) => set("intro", html)} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Servicios</h2>
        <RepeatableList
          items={values.servicios}
          onChange={(servicios) => set("servicios", servicios)}
          newItem={() => ({ title: "Servicio nuevo", text: "" })}
          addLabel="Agregar servicio"
          renderItem={(item, update) => (
            <>
              <div className="space-y-2">
                <Label>Título</Label>
                <Input value={item.title} onChange={(e) => update({ title: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Input value={item.text} onChange={(e) => update({ text: e.target.value })} required />
              </div>
            </>
          )}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Cómo trabajamos (pasos)</h2>
        <RepeatableList
          items={values.pasos}
          onChange={(pasos) => set("pasos", pasos)}
          newItem={() => ({ title: "Paso nuevo", text: "" })}
          addLabel="Agregar paso"
          renderItem={(item, update) => (
            <>
              <div className="space-y-2">
                <Label>Título</Label>
                <Input value={item.title} onChange={(e) => update({ title: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Input value={item.text} onChange={(e) => update({ text: e.target.value })} required />
              </div>
            </>
          )}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Llamado a la acción final</h2>
        <div className="space-y-2">
          <Label>Título</Label>
          <Input value={values.ctaTitle} onChange={(e) => set("ctaTitle", e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Texto</Label>
          <Input value={values.ctaText} onChange={(e) => set("ctaText", e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Mensaje precargado de WhatsApp</Label>
          <Input
            value={values.whatsappSubject}
            onChange={(e) => set("whatsappSubject", e.target.value)}
            required
          />
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
