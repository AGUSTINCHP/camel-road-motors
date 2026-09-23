/**
 * Comprime y redimensiona una foto en el navegador antes de subirla — clave
 * en celular, donde las fotos de la cámara suelen pesar varios MB (y en
 * iPhone a veces vienen en HEIC). Al pasar todo por <canvas> y exportarlo
 * como JPEG, de paso convertimos cualquier formato que el navegador pueda
 * decodificar (Safari en iOS decodifica HEIC de forma nativa).
 *
 * Si el navegador no puede decodificar el archivo (formato no soportado en
 * ese navegador) o la compresión no achica el archivo, se sube el original
 * tal cual — nunca bloquea la carga.
 */
export async function compressImage(
  file: File,
  { maxDimension = 1920, quality = 0.82 }: { maxDimension?: number; quality?: number } = {},
): Promise<File> {
  if (typeof createImageBitmap === "undefined") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality),
    );
    if (!blob || blob.size >= file.size) return file;

    const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], newName, { type: "image/jpeg" });
  } catch {
    return file;
  }
}
