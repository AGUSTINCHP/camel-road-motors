import { createServerFn } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";
import { z } from "zod";
import {
  createVehicle,
  deleteVehicle,
  getPublishedVehicleBySlug,
  getVehicleById,
  listAllVehicles,
  listPublishedVehicles,
  updateVehicle,
  type StoredVehicle,
  type VehicleInput,
} from "@/lib/vehicle-store.server";
import {
  isAdminAuthenticated,
  loginAdmin,
  logoutAdmin,
  requireAdmin,
} from "@/lib/admin-session.server";

// ---------- Públicas (catálogo) ----------

export const fetchPublishedVehicles = createServerFn({ method: "GET" }).handler(async () => {
  return listPublishedVehicles();
});

export const fetchVehicleBySlug = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    return (await getPublishedVehicleBySlug(slug)) ?? null;
  });

export const fetchVehiclesByIds = createServerFn({ method: "GET" })
  .inputValidator((ids: string[]) => ids)
  .handler(async ({ data: ids }) => {
    const published = await listPublishedVehicles();
    const byId = new Map(published.map((v) => [v.id, v]));
    return ids.map((id) => byId.get(id)).filter((v): v is StoredVehicle => Boolean(v));
  });

// ---------- Sesión de admin ----------

export const fetchAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  return { isAdmin: await isAdminAuthenticated() };
});

export const loginAdminFn = createServerFn({ method: "POST" })
  .inputValidator((password: string) => password)
  .handler(async ({ data: password }) => {
    const ok = await loginAdmin(password);
    if (!ok) throw new Error("Contraseña incorrecta");
    return { ok: true };
  });

export const logoutAdminFn = createServerFn({ method: "POST" }).handler(async () => {
  await logoutAdmin();
  throw redirect({ to: "/admin/login" });
});

// ---------- CRUD de admin (protegido) ----------

const vehicleInputSchema = z.object({
  type: z.enum(["auto", "camioneta", "moto", "cuatriciclo", "lancha"]),
  brand: z.string().min(1),
  model: z.string().min(1),
  version: z.string().min(1),
  year: z.coerce.number().int().min(1970).max(2100),
  price: z.coerce.number().min(0),
  currency: z.enum(["USD", "ARS"]),
  km: z.coerce.number().min(0),
  fuel: z.string().min(1),
  transmission: z.string().min(1),
  engine: z.string().min(1),
  color: z.string().min(1),
  location: z.string().min(1),
  doors: z.coerce.number().optional(),
  images: z.array(z.string()).min(1, "Subí al menos una foto"),
  highlights: z.array(z.string()),
  featured: z.boolean(),
  published: z.boolean(),
  cost: z.coerce.number().min(0).optional(),
  costCurrency: z.enum(["USD", "ARS"]).optional(),
});

export const adminListVehicles = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  return listAllVehicles();
});

export const adminGetVehicle = createServerFn({ method: "GET" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    await requireAdmin();
    return (await getVehicleById(id)) ?? null;
  });

export const adminCreateVehicle = createServerFn({ method: "POST" })
  .inputValidator((input: VehicleInput) => vehicleInputSchema.parse(input))
  .handler(async ({ data }) => {
    await requireAdmin();
    return createVehicle(data);
  });

export const adminUpdateVehicle = createServerFn({ method: "POST" })
  .inputValidator((input: { id: string; patch: Partial<VehicleInput> }) => input)
  .handler(async ({ data }) => {
    await requireAdmin();
    return updateVehicle(data.id, data.patch);
  });

export const adminDeleteVehicle = createServerFn({ method: "POST" })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    await requireAdmin();
    await deleteVehicle(id);
    return { ok: true };
  });

// ---------- Carga masiva por planilla ----------
// Los vehículos importados por CSV nunca traen fotos (una planilla no puede
// llevar archivos), así que se crean siempre como borrador (sin publicar)
// para que no aparezcan en el catálogo hasta que alguien les suba fotos.

// Solo marca y modelo son realmente indispensables — el resto de los datos
// de una planilla suele venir incompleto (no siempre se carga motor,
// versión, etc. a mano), así que se aceptan vacíos en vez de rechazar la fila.
const bulkRowSchema = z.object({
  type: z.enum(["auto", "camioneta", "moto", "cuatriciclo", "lancha"]),
  brand: z.string().min(1, "Falta la marca"),
  model: z.string().min(1, "Falta el modelo"),
  version: z.string(),
  year: z.coerce.number().int().min(1970).max(2100),
  price: z.coerce.number().min(0),
  currency: z.enum(["USD", "ARS"]),
  km: z.coerce.number().min(0),
  fuel: z.string(),
  transmission: z.string(),
  engine: z.string(),
  color: z.string(),
  location: z.string(),
  doors: z.coerce.number().optional(),
  highlights: z.array(z.string()),
  featured: z.boolean(),
  cost: z.coerce.number().min(0).optional(),
  costCurrency: z.enum(["USD", "ARS"]).optional(),
});

export const adminBulkImportVehicles = createServerFn({ method: "POST" })
  .inputValidator((rows: unknown[]) => rows)
  .handler(async ({ data: rows }) => {
    await requireAdmin();
    let created = 0;
    const errors: { row: number; message: string }[] = [];
    for (let i = 0; i < rows.length; i++) {
      const parsed = bulkRowSchema.safeParse(rows[i]);
      if (!parsed.success) {
        const issue = parsed.error.issues[0];
        const field = issue?.path.join(".");
        const message = issue
          ? field
            ? `${field}: ${issue.message}`
            : issue.message
          : "Fila inválida";
        errors.push({ row: i + 1, message });
        continue;
      }
      try {
        await createVehicle({ ...parsed.data, images: [], published: false });
        created++;
      } catch (err) {
        errors.push({
          row: i + 1,
          message: err instanceof Error ? err.message : "No se pudo crear",
        });
      }
    }
    return { created, errors };
  });
