import { useEffect, useState, type FormEvent } from "react";
import { adminUpdateHome } from "@/lib/site-content.server";
import type { SiteContent } from "@/lib/site-content-store.server";
import { writeDraft, clearDraft } from "@/lib/content-draft";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageField } from "@/components/admin/content/ImageField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PILLAR_NAMES = ["Venta de usados", "Gestoría automotor", "Seguros"];

export function HomeContentForm({
  initial,
  onSaved,
}: {
  initial: SiteContent["home"];
  onSaved: () => void;
}) {
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    writeDraft("home", values);
  }, [values]);

  function set<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setSaved(false);
  }

  function setPillar(index: 0 | 1 | 2, patch: Partial<{ title: string; text: string }>) {
    const pillars = [...values.pillars] as typeof values.pillars;
    pillars[index] = { ...pillars[index], ...patch };
    set("pillars", pillars);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await adminUpdateHome({ data: values });
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
        <h2 className="text-lg font-semibold">Portada (hero)</h2>
        <div className="space-y-2">
          <Label>Texto pequeño arriba del título</Label>
          <Input
            value={values.heroEyebrow}
            onChange={(e) => set("heroEyebrow", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Título grande</Label>
          <Input value={values.heroTitle} onChange={(e) => set("heroTitle", e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Texto debajo del título</Label>
          <RichTextEditor value={values.heroSubtitle} onChange={(html) => set("heroSubtitle", html)} />
        </div>
        <ImageField
          label="Foto de fondo"
          value={values.heroImage}
          onChange={(url) => set("heroImage", url)}
          hint="Horizontal, ideal 1920×1080px o más ancha. Se ve con un degradado oscuro encima, así que fotos con buen contraste funcionan mejor."
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Sobre nosotros</h2>
        <div className="space-y-2">
          <Label>Título</Label>
          <Input value={values.aboutTitle} onChange={(e) => set("aboutTitle", e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Texto</Label>
          <RichTextEditor value={values.aboutText} onChange={(html) => set("aboutText", html)} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Los 3 pilares</h2>
        <p className="text-xs text-muted-foreground">
          Van en ese orden fijo (venta, gestoría, seguros) porque los dos últimos enlazan a esas
          páginas — solo se edita el título y el texto de cada uno.
        </p>
        {values.pillars.map((p, i) => (
          <div key={PILLAR_NAMES[i]} className="grid gap-3 border border-border p-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{PILLAR_NAMES[i]} — título</Label>
              <Input
                value={p.title}
                onChange={(e) => setPillar(i as 0 | 1 | 2, { title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>{PILLAR_NAMES[i]} — texto</Label>
              <Input
                value={p.text}
                onChange={(e) => setPillar(i as 0 | 1 | 2, { text: e.target.value })}
                required
              />
            </div>
          </div>
        ))}
      </section>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {saved ? <p className="text-sm text-camel">Guardado.</p> : null}

      <Button type="submit" disabled={saving}>
        {saving ? "Guardando…" : "Guardar cambios"}
      </Button>
    </form>
  );
}
