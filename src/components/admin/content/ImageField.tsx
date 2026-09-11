import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { uploadVehiclePhoto } from "@/lib/upload.server";
import { RetryImage } from "@/components/admin/RetryImage";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function ImageField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleChange(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadVehiclePhoto({ data: formData });
      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la foto.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        {value ? (
          <RetryImage src={value} alt="" className="h-20 w-32 border border-border object-cover" />
        ) : (
          <div className="flex h-20 w-32 items-center justify-center border border-dashed border-border text-[10px] text-muted-foreground">
            Foto por defecto
          </div>
        )}
        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="mr-1.5 h-3.5 w-3.5" />
            )}
            {uploading ? "Subiendo…" : "Cambiar foto"}
          </Button>
          {value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="block text-xs text-muted-foreground underline hover:text-foreground"
            >
              Volver a la foto por defecto
            </button>
          ) : null}
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleChange(e.target.files)}
      />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
