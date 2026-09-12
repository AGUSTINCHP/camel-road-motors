// Server-only. Guarda fotos subidas desde el panel en el bucket público
// `uploads` de Supabase Storage y devuelve la URL pública (servida por el
// CDN de Supabase, no por este servidor).
import { randomUUID } from "node:crypto";
import { extname } from "node:path";
import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "@/lib/admin-session.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const CONTENT_TYPE: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB por foto

export const uploadVehiclePhoto = createServerFn({ method: "POST" })
  .inputValidator((formData: FormData) => formData)
  .handler(async ({ data: formData }) => {
    await requireAdmin();
    const file = formData.get("file");
    if (!(file instanceof File)) throw new Error("Archivo inválido");

    const ext = extname(file.name).toLowerCase();
    const contentType = CONTENT_TYPE[ext];
    if (!contentType) {
      throw new Error("Formato no soportado. Usá JPG, PNG o WEBP.");
    }
    if (file.size > MAX_SIZE_BYTES) {
      throw new Error("La foto pesa demasiado (máximo 8MB).");
    }

    const filename = `${randomUUID()}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error } = await supabaseAdmin.storage.from("uploads").upload(filename, buffer, {
      contentType,
      cacheControl: "31536000",
    });
    if (error) throw new Error(error.message);

    const { data } = supabaseAdmin.storage.from("uploads").getPublicUrl(filename);
    return { url: data.publicUrl };
  });
