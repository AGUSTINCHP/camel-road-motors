// Server-only. Guarda fotos subidas desde el panel en data/uploads y
// devuelve la ruta pública (/uploads/<archivo>, servida por
// serve-upload.server.ts) para guardarla en el vehículo. Igual que el
// store de vehículos: funciona sobre filesystem local (Node persistente).
// Si se despliega en un runtime sin disco, se reemplaza por un bucket
// (S3, R2, etc.) sin cambiar la forma en que el front la usa.
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "@/lib/admin-session.server";

const UPLOADS_DIR = join(process.cwd(), "data", "uploads");

const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB por foto

export const uploadVehiclePhoto = createServerFn({ method: "POST" })
  .inputValidator((formData: FormData) => formData)
  .handler(async ({ data: formData }) => {
    await requireAdmin();
    const file = formData.get("file");
    if (!(file instanceof File)) throw new Error("Archivo inválido");

    const ext = extname(file.name).toLowerCase();
    if (!ALLOWED_EXT.has(ext)) {
      throw new Error("Formato no soportado. Usá JPG, PNG o WEBP.");
    }
    if (file.size > MAX_SIZE_BYTES) {
      throw new Error("La foto pesa demasiado (máximo 8MB).");
    }

    await mkdir(UPLOADS_DIR, { recursive: true });
    const filename = `${randomUUID()}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(UPLOADS_DIR, filename), buffer);

    return { url: `/uploads/${filename}` };
  });
