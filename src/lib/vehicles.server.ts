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
import { isAdminAuthenticated, loginAdmin, logoutAdmin, requireAdmin } from "@/lib/admin-session.server";

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
  type: z.enum(["auto", "moto", "cuatriciclo", "lancha"]),
  brand: z.string().min(1),
  model: z.string().min(1),
  version: z.string().min(1),
  year: z.coerce.number().int().min(1970).max(2100),
  price: z.coerce.number().min(0),
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
