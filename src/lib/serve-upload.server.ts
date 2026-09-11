// Server-only. Sirve las fotos subidas desde el panel (guardadas en
// data/uploads/, ver upload.server.ts) en /uploads/<archivo>.
//
// No se puede confiar en que el framework sirva estos archivos como
// "estáticos": el preset node-server de nitro arma, al momento del build,
// una lista fija de los archivos que va a servir — cualquier foto subida
// después de ese build (o sea, cualquier foto subida en producción) queda
// afuera de esa lista y nunca se serviría. Por eso esta ruta lee el
// archivo del disco en cada pedido, en vez de depender de esa lista.
import { readFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";

const UPLOADS_DIR = join(process.cwd(), "data", "uploads");

const CONTENT_TYPE: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

/** Si la request pide /uploads/<archivo>, devuelve la respuesta (o 404); si no, null para que siga el flujo normal. */
export async function tryServeUpload(request: Request): Promise<Response | null> {
  const { pathname } = new URL(request.url);
  const prefix = "/uploads/";
  if (!pathname.startsWith(prefix)) return null;

  // basename() descarta cualquier intento de "../" — el nombre siempre es
  // el que generamos nosotros en upload.server.ts (un UUID + extensión).
  const filename = basename(pathname.slice(prefix.length));
  const contentType = CONTENT_TYPE[extname(filename).toLowerCase()];
  if (!filename || !contentType) return new Response("Not found", { status: 404 });

  try {
    const buffer = await readFile(join(UPLOADS_DIR, filename));
    return new Response(new Uint8Array(buffer), {
      headers: {
        "content-type": contentType,
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
