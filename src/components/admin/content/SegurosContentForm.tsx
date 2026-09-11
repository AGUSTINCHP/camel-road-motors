import { useEffect, useState, type FormEvent } from "react";
import { adminUpdateSeguros } from "@/lib/site-content.server";
import type { SiteContent } from "@/lib/site-content-store.server";
import { writeDraft, clearDraft } from "@/lib/content-draft";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { RepeatableList } from "@/components/admin/RepeatableList";
import { ImageField } from "@/components/admin/content/ImageField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function SegurosContentForm({
  initial,
  onSaved,
}: {
  initial: SiteContent["seguros"];
  onSaved: () => void;
}) {
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    writeDraft("seguros", values);
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
      await adminUpdateSeguros({ data: values });
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
        <h2 className="text-lg font-semibold">Coberturas</h2>
        <RepeatableList
          items={values.coberturas}
          onChange={(coberturas) => set("coberturas", coberturas)}
          newItem={() => ({ name: "Cobertura nueva", text: "", items: ["Ítem"] })}
          addLabel="Agregar cobertura"
          renderItem={(item, update) => (
            <>
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input value={item.name} onChange={(e) => update({ name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Descripción corta</Label>
                <Input value={item.text} onChange={(e) => update({ text: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Ítems incluidos (uno por línea)</Label>
                <Textarea
                  value={item.items.join("\n")}
                  onChange={(e) => update({ items: e.target.value.split("\n").filter(Boolean) })}
                  rows={3}
                />
              </div>
            </>
          )}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Beneficios</h2>
        <Label>Uno por línea</Label>
        <Textarea
          value={values.beneficios.join("\n")}
          onChange={(e) => set("beneficios", e.target.value.split("\n").filter(Boolean))}
          rows={5}
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
