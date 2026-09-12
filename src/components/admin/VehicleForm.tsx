import { useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Loader2, Star, Upload, X } from "lucide-react";
import type { StoredVehicle } from "@/lib/vehicle-store.server";
import type { Currency, VehicleType } from "@/data/vehicles";
import { uploadVehiclePhoto } from "@/lib/upload.server";
import { useSiteContent } from "@/lib/site-content-context";
import { RetryImage } from "@/components/admin/RetryImage";
import { ComboboxField } from "@/components/admin/ComboboxField";
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
  currency: Currency;
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

/** Datos mínimos del resto del stock, para armar los desplegables de marca/modelo/color a partir de lo que ya cargaste (en vez de un catálogo fijo). */
export type VehicleSuggestionSource = {
  type: VehicleType;
  brand: string;
  model: string;
  color: string;
};

const TYPES: { value: VehicleType; label: string }[] = [
  { value: "auto", label: "Auto" },
  { value: "camioneta", label: "Camioneta" },
  { value: "moto", label: "Moto" },
  { value: "cuatriciclo", label: "Cuatriciclo" },
  { value: "lancha", label: "Lancha" },
];

const CURRENCIES: { value: Currency; label: string }[] = [
  { value: "USD", label: "Dólares (USD)" },
  { value: "ARS", label: "Pesos (ARS)" },
];

const DOOR_TYPES: VehicleType[] = ["auto", "camioneta"];
const DOOR_OPTIONS = [2, 3, 4, 5];

const FUEL_OPTIONS = ["Nafta", "Diésel", "GNC", "Nafta/GNC", "Eléctrico", "Híbrido"];
const TRANSMISSION_OPTIONS = ["Manual", "Automática", "CVT", "Automática secuencial"];
const COLOR_PALETTE = [
  "Blanco",
  "Negro",
  "Gris",
  "Gris Platino",
  "Gris Oscuro",
  "Plata",
  "Rojo",
  "Azul",
  "Verde",
  "Amarillo",
  "Naranja",
  "Beige",
  "Marrón",
  "Negro Mate",
];

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: currentYear - 1969 }, (_, i) => currentYear + 1 - i);

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
    year: currentYear,
    price: 0,
    currency: "USD",
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

export function VehicleForm({
  initial,
  onSubmit,
  submitLabel,
  suggestionSource = [],
}: {
  initial?: StoredVehicle;
  onSubmit: (values: VehicleFormValues) => Promise<void>;
  submitLabel: string;
  /** Resto de los vehículos ya cargados, para sugerir marca/modelo/color. */
  suggestionSource?: VehicleSuggestionSource[];
}) {
  const { contact } = useSiteContent();
  const [values, setValues] = useState<VehicleFormValues>(() =>
    initial
      ? {
          type: initial.type,
          brand: initial.brand,
          model: initial.model,
          version: initial.version,
          year: initial.year,
          price: initial.price,
          currency: initial.currency,
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

  const locationOptions = useMemo(
    () => contact.zones.map((z) => z.title),
    [contact.zones],
  );

  const brandOptions = useMemo(
    () =>
      suggestionSource.filter((v) => v.type === values.type).map((v) => v.brand),
    [suggestionSource, values.type],
  );

  const modelOptions = useMemo(
    () =>
      suggestionSource
        .filter((v) => v.brand.toLowerCase() === values.brand.trim().toLowerCase())
        .map((v) => v.model),
    [suggestionSource, values.brand],
  );

  const colorOptions = useMemo(
    () => [...COLOR_PALETTE, ...suggestionSource.map((v) => v.color)],
    [suggestionSource],
  );

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

  function moveImage(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= values.images.length) return;
    const next = [...values.images];
    [next[index], next[target]] = [next[target]!, next[index]!];
    set("images", next);
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
          <ComboboxField
            label="Ubicación"
            value={values.location}
            onChange={(v) => set("location", v)}
            options={locationOptions}
            placeholder="Zona donde está el vehículo"
            required
          />
          <ComboboxField
            label="Marca"
            value={values.brand}
            onChange={(v) => set("brand", v)}
            options={brandOptions}
            required
          />
          <ComboboxField
            label="Modelo"
            value={values.model}
            onChange={(v) => set("model", v)}
            options={modelOptions}
            required
          />
          <div className="space-y-2 sm:col-span-2">
            <Label>Versión</Label>
            <Input value={values.version} onChange={(e) => set("version", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Año</Label>
            <Select
              value={String(values.year)}
              onValueChange={(v) => set("year", Number(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEAR_OPTIONS.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Precio</Label>
            <Input
              type="number"
              value={values.price}
              onChange={(e) => set("price", Number(e.target.value))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Moneda</Label>
            <Select value={values.currency} onValueChange={(v) => set("currency", v as Currency)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          <ComboboxField
            label="Color"
            value={values.color}
            onChange={(v) => set("color", v)}
            options={colorOptions}
            required
          />
          <ComboboxField
            label="Combustible"
            value={values.fuel}
            onChange={(v) => set("fuel", v)}
            options={FUEL_OPTIONS}
            required
          />
          <ComboboxField
            label="Transmisión"
            value={values.transmission}
            onChange={(v) => set("transmission", v)}
            options={TRANSMISSION_OPTIONS}
            required
          />
          <div className="space-y-2">
            <Label>Motor</Label>
            <Input value={values.engine} onChange={(e) => set("engine", e.target.value)} required />
          </div>
          {DOOR_TYPES.includes(values.type) ? (
            <div className="space-y-2">
              <Label>Puertas</Label>
              <Select
                value={values.doors ? String(values.doors) : "none"}
                onValueChange={(v) => set("doors", v === "none" ? undefined : Number(v))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sin especificar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin especificar</SelectItem>
                  {DOOR_OPTIONS.map((d) => (
                    <SelectItem key={d} value={String(d)}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Fotos</h2>
        <div className="flex flex-wrap gap-3">
          {values.images.map((url, index) => (
            <div key={url} className="group relative h-24 w-24 overflow-hidden border border-border">
              <RetryImage src={url} alt="" className="h-full w-full object-cover" />
              {index === 0 ? (
                <span className="absolute left-1 top-1 bg-camel px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-accent-foreground">
                  Portada
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute right-1 top-1 rounded-full bg-ink/80 p-1 text-primary-foreground"
                aria-label="Quitar foto"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-ink/70 px-1 py-1 opacity-0 transition group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => moveImage(index, -1)}
                  disabled={index === 0}
                  aria-label="Mover antes"
                  className="p-1 text-primary-foreground disabled:opacity-30"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(index, 1)}
                  disabled={index === values.images.length - 1}
                  aria-label="Mover después"
                  className="p-1 text-primary-foreground disabled:opacity-30"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
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
          Podés seleccionar varias fotos a la vez. Pasá el mouse sobre una foto para reordenarla
          (las flechas) o para quitarla (la X) — la primera de la lista es la portada, la que se
          ve en el catálogo y en las tarjetas.
        </p>
        <p className="text-xs text-muted-foreground">
          <strong>Formato recomendado:</strong> fotos horizontales (apaisadas, no verticales),
          en JPG o WEBP, de al menos 1200×900px. Con buena luz natural, el vehículo completo y
          centrado en el cuadro. Ideal que pesen entre 300KB y 2MB cada una — aceptamos hasta
          8MB, pero fotos más livianas cargan más rápido en el celular del cliente.
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
