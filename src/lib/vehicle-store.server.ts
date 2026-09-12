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
};

export type StoredVehicle = Vehicle & { published: boolean };

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

export async function listAllVehicles(): Promise<StoredVehicle[]> {
  const { data, error } = await supabaseAdmin
    .from("vehicles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToVehicle);
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

export async function getVehicleById(id: string): Promise<StoredVehicle | undefined> {
  const { data, error } = await supabaseAdmin.from("vehicles").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToVehicle(data) : undefined;
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

export async function createVehicle(input: VehicleInput): Promise<StoredVehicle> {
  const baseSlug = slugify(`${input.brand}-${input.model}-${input.version}-${input.year}`);
  const { data: clash } = await supabaseAdmin
    .from("vehicles")
    .select("id")
    .eq("slug", baseSlug)
    .maybeSingle();
  const slug = clash ? `${baseSlug}-${Math.random().toString(36).slice(2, 6)}` : baseSlug;

  const insert: TablesInsert<"vehicles"> = { ...input, slug };
  const { data, error } = await supabaseAdmin.from("vehicles").insert(insert).select().single();
  if (error) throw new Error(error.message);
  return rowToVehicle(data);
}

export async function updateVehicle(
  id: string,
  patch: Partial<VehicleInput>,
): Promise<StoredVehicle> {
  const { data, error } = await supabaseAdmin
    .from("vehicles")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return rowToVehicle(data);
}

export async function deleteVehicle(id: string): Promise<void> {
  const { error } = await supabaseAdmin.from("vehicles").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
