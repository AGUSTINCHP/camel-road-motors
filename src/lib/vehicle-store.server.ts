// Server-only. Persiste el stock de vehículos en Supabase (tabla
// `vehicles`, ver supabase/config.toml) a través del cliente admin, que
// usa la service role y bypassa RLS — ver
// src/integrations/supabase/client.server.ts. Todo pasa por las funciones
// de abajo, así que cambiar de backend en el futuro no toca el resto del
// código.
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import type { Currency, Vehicle, VehicleType } from "@/data/vehicles";

export type VehicleInput = {
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
  /** Costo de adquisición — uso interno, nunca se expone en el catálogo público. */
  cost?: number | undefined;
  costCurrency?: Currency | undefined;
};

export type StoredVehicle = Vehicle & { published: boolean };

/** Igual que StoredVehicle pero con el costo interno — solo para las funciones de admin. */
export type AdminStoredVehicle = StoredVehicle & {
  cost?: number | undefined;
  costCurrency?: Currency | undefined;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function rowToVehicle(row: Tables<"vehicles">): StoredVehicle {
  const ageMs = Date.now() - new Date(row.created_at).getTime();
  return {
    id: row.id,
    slug: row.slug,
    type: row.type as VehicleType,
    brand: row.brand,
    model: row.model,
    version: row.version,
    year: row.year,
    price: Number(row.price),
    currency: row.currency as Currency,
    km: row.km,
    fuel: row.fuel,
    transmission: row.transmission,
    engine: row.engine,
    color: row.color,
    location: row.location,
    doors: row.doors ?? undefined,
    images: (row.images as string[] | null) ?? [],
    highlights: (row.highlights as string[] | null) ?? [],
    featured: row.featured,
    published: row.published,
    addedDaysAgo: Math.max(0, Math.floor(ageMs / 86_400_000)),
  };
}

/** Como rowToVehicle, pero incluye el costo — solo para uso en funciones de admin. */
function rowToAdminVehicle(row: Tables<"vehicles">): AdminStoredVehicle {
  return {
    ...rowToVehicle(row),
    cost: row.cost ?? undefined,
    costCurrency: (row.cost_currency as Currency | null) ?? undefined,
  };
}

export async function listAllVehicles(): Promise<AdminStoredVehicle[]> {
  const { data, error } = await supabaseAdmin
    .from("vehicles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToAdminVehicle);
}

export async function listPublishedVehicles(): Promise<StoredVehicle[]> {
  const { data, error } = await supabaseAdmin
    .from("vehicles")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToVehicle);
}

export async function getVehicleById(id: string): Promise<AdminStoredVehicle | undefined> {
  const { data, error } = await supabaseAdmin.from("vehicles").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToAdminVehicle(data) : undefined;
}

export async function getPublishedVehicleBySlug(
  slug: string,
): Promise<StoredVehicle | undefined> {
  const { data, error } = await supabaseAdmin
    .from("vehicles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToVehicle(data) : undefined;
}

export async function createVehicle(input: VehicleInput): Promise<AdminStoredVehicle> {
  const baseSlug = slugify(`${input.brand}-${input.model}-${input.version}-${input.year}`);
  const { data: clash } = await supabaseAdmin
    .from("vehicles")
    .select("id")
    .eq("slug", baseSlug)
    .maybeSingle();
  const slug = clash ? `${baseSlug}-${Math.random().toString(36).slice(2, 6)}` : baseSlug;

  const { cost, costCurrency, ...rest } = input;
  const insert: TablesInsert<"vehicles"> = {
    ...rest,
    slug,
    cost: cost ?? null,
    cost_currency: costCurrency ?? null,
  };
  const { data, error } = await supabaseAdmin.from("vehicles").insert(insert).select().single();
  if (error) throw new Error(error.message);
  return rowToAdminVehicle(data);
}

export async function updateVehicle(
  id: string,
  patch: Partial<VehicleInput>,
): Promise<AdminStoredVehicle> {
  const { cost, costCurrency, ...rest } = patch;
  const update: Partial<TablesInsert<"vehicles">> = { ...rest };
  if ("cost" in patch) update.cost = cost ?? null;
  if ("costCurrency" in patch) update.cost_currency = costCurrency ?? null;

  const { data, error } = await supabaseAdmin
    .from("vehicles")
    .update(update)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return rowToAdminVehicle(data);
}

export async function deleteVehicle(id: string): Promise<void> {
  const { error } = await supabaseAdmin.from("vehicles").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
