import { useRef, useState, type FormEvent } from "react";
import { Loader2, Star, Upload, X } from "lucide-react";
import type { StoredVehicle } from "@/lib/vehicle-store.server";
import type { VehicleType } from "@/data/vehicles";
import { uploadVehiclePhoto } from "@/lib/upload.server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type VehicleFormValues = {
  type: VehicleType;
  brand: string;
  model: string;
  version: string;
  year: number;
  price: number;
  km: number;
  fuel: string;
  transmission: string;
  engine: string;
  color: string;
  location: string;
  doors?: number | undefined;
  images: string[];
  highlights: string[];
  featured: boolean;
  published: boolean;
};

const TYPES: { value: VehicleType; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "moto", label: "Moto" },
  { value: "cuatriciclo", label: "Cuatriciclo" },
  { value: "lancha", label: "Lancha" },
];

const DEFAULT_HIGHLIGHTS = [
  "Motor y caja verificados en banco",
  "Service al día con historial",
  "Documentación y transferencia sin deuda",
];

function emptyValues(): VehicleFormValues {
  return {
    type: "auto",
    brand: "",
    model: "",
    version: "",
    year: new Date().getFullYear(),
    price: 0,
    km: 0,
    fuel: "Nafta",
    transmission: "Manual",
    engine: "",
    color: "",
    location: "",
    images: [],
    highlights: [...DEFAULT_HIGHLIGHTS],
    featured: false,
    published: true,
  };
}

// El dev server tarda un instante en "enterarse" de una foto recién subida a
// /public/uploads: la primera carga puede devolver 404 aunque el archivo ya
// esté en disco. Reintenta un par de veces antes de darse por vencido.
const MAX_IMAGE_RETRIES = 3;

function RetryImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [attempt, setAttempt] = useState(0);

  return (
    <img
      key={src}
      src={attempt === 0 ? src : `${src}?retry=${attempt}`}
      alt={alt}
      className={className}
      onError={() => {
        if (attempt < MAX_IMAGE_RETRIES) {
          setTimeout(() => setAttempt((a) => a + 1), 400 * (attempt + 1));
        }
      }}
    />
  );
}

export function VehicleForm({
  initial,
  onSubmit,
  submitLabel,
}: {
  initial?: StoredVehicle;
  onSubmit: (values: VehicleFormValues) => Promise<void>;
  submitLabel: string;
}) {
  const [values, setValues] = useState<VehicleFormValues>(() =>
    initial
      ? {
          type: initial.type,
          brand: initial.brand,
          model: initial.model,
          version: initial.version,
          year: initial.year,
          price: initial.price,
          km: initial.km,
          fuel: initial.fuel,
          transmission: initial.transmission,
          engine: initial.engine,
          color: initial.color,
          location: initial.location,
          doors: initial.doors,
          images: initial.images,
          highlights: initial.highlights,
          featured: initial.featured,
          published: initial.published,
        }
      : emptyValues(),
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof VehicleFormValues>(key: K, value: VehicleFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const result = await uploadVehiclePhoto({ data: formData });
        uploaded.push(result.url);
      }
      set("images", [...values.images, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la foto.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removeImage(url: string) {
    set(
      "images",
      values.images.filter((i) => i !== url),
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (values.images.length === 0) {
      setError("Subí al menos una foto del vehículo.");
      return;
    }
    setSaving(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-8 p-6">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Datos del vehículo</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select value={values.type} onValueChange={(v) => set("type", v as VehicleType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Ubicación</Label>
            <Input value={values.location} onChange={(e) => set("location", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Marca</Label>
            <Input value={values.brand} onChange={(e) => set("brand", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Modelo</Label>
            <Input value={values.model} onChange={(e) => set("model", e.target.value)} required />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Versión</Label>
            <Input value={values.version} onChange={(e) => set("version", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Año</Label>
            <Input
              type="number"
              value={values.year}
              onChange={(e) => set("year", Number(e.target.value))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Precio (USD)</Label>
            <Input
              type="number"
              value={values.price}
              onChange={(e) => set("price", Number(e.target.value))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Kilometraje</Label>
            <Input
              type="number"
              value={values.km}
              onChange={(e) => set("km", Number(e.target.value))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Color</Label>
            <Input value={values.color} onChange={(e) => set("color", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Combustible</Label>
            <Input value={values.fuel} onChange={(e) => set("fuel", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Transmisión</Label>
            <Input
              value={values.transmission}
              onChange={(e) => set("transmission", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Motor</Label>
            <Input value={values.engine} onChange={(e) => set("engine", e.target.value)} required />
          </div>
          {values.type === "auto" ? (
            <div className="space-y-2">
              <Label>Puertas</Label>
              <Input
                type="number"
                value={values.doors ?? ""}
                onChange={(e) => set("doors", e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Fotos</h2>
        <div className="flex flex-wrap gap-3">
          {values.images.map((url) => (
            <div key={url} className="group relative h-24 w-24 overflow-hidden border border-border">
              <RetryImage src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute right-1 top-1 rounded-full bg-ink/80 p-1 text-primary-foreground"
                aria-label="Quitar foto"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex h-24 w-24 flex-col items-center justify-center gap-1 border border-dashed border-border text-muted-foreground hover:border-camel"
          >
            {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
            <span className="text-[10px] uppercase tracking-wide">
              {uploading ? "Subiendo…" : "Agregar"}
            </span>
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <p className="text-xs text-muted-foreground">
          Podés seleccionar varias fotos a la vez. JPG, PNG o WEBP, hasta 8MB c/u.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Checklist de verificación</h2>
        <Textarea
          value={values.highlights.join("\n")}
          onChange={(e) => set("highlights", e.target.value.split("\n").filter(Boolean))}
          rows={4}
          placeholder="Un ítem por línea"
        />
      </section>

      <section className="flex flex-wrap items-center gap-8">
        <label className="flex items-center gap-3">
          <Switch checked={values.published} onCheckedChange={(v) => set("published", v)} />
          <span className="text-sm">Publicado en el catálogo</span>
        </label>
        <label className="flex items-center gap-3">
          <Switch checked={values.featured} onCheckedChange={(v) => set("featured", v)} />
          <span className="flex items-center gap-1.5 text-sm">
            <Star className="h-3.5 w-3.5" /> Destacado en home
          </span>
        </label>
      </section>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" size="lg" disabled={saving || uploading}>
        {saving ? "Guardando…" : submitLabel}
      </Button>
    </form>
  );
}
