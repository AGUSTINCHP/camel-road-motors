// Server-only. Persiste el stock de vehículos en un archivo JSON local
// (data/vehicles-store.json). Se siembra una sola vez con el mock original
// la primera vez que se lee. Pensado para correr con `npm run dev` /
// un servidor Node persistente — si el día de mañana se despliega en un
// runtime "edge" sin filesystem (ej. Cloudflare Workers), esta capa se
// reemplaza por una base real (D1, Postgres, etc.) sin tocar el resto del
// código: todo pasa por las funciones de abajo.
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  vehicles as seedVehicles,
  type Currency,
  type Vehicle,
  type VehicleType,
} from "@/data/vehicles";

// process.cwd() (no una ruta relativa al archivo) — así el JSON queda al
// lado del proyecto y no dentro de .output/, que se borra en cada build.
const DATA_DIR = join(process.cwd(), "data");
const STORE_PATH = join(DATA_DIR, "vehicles-store.json");

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

async function ensureStore(): Promise<StoredVehicle[]> {
  try {
    const raw = await readFile(STORE_PATH, "utf-8");
    return JSON.parse(raw) as StoredVehicle[];
  } catch {
    const seeded: StoredVehicle[] = seedVehicles.map((v) => ({ ...v, published: true }));
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(STORE_PATH, JSON.stringify(seeded, null, 2), "utf-8");
    return seeded;
  }
}

async function persist(list: StoredVehicle[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(list, null, 2), "utf-8");
}

export async function listAllVehicles(): Promise<StoredVehicle[]> {
  return ensureStore();
}

export async function listPublishedVehicles(): Promise<StoredVehicle[]> {
  const all = await ensureStore();
  return all.filter((v) => v.published);
}

export async function getVehicleById(id: string): Promise<StoredVehicle | undefined> {
  const all = await ensureStore();
  return all.find((v) => v.id === id);
}

export async function getPublishedVehicleBySlug(
  slug: string,
): Promise<StoredVehicle | undefined> {
  const all = await ensureStore();
  return all.find((v) => v.slug === slug && v.published);
}

export async function createVehicle(input: VehicleInput): Promise<StoredVehicle> {
  const all = await ensureStore();
  const id = `v-${randomUUID()}`;
  const baseSlug = slugify(`${input.brand}-${input.model}-${input.version}-${input.year}`);
  const slug = all.some((v) => v.slug === baseSlug) ? `${baseSlug}-${id.slice(2, 6)}` : baseSlug;
  const vehicle: StoredVehicle = {
    ...input,
    id,
    slug,
    addedDaysAgo: 0,
  };
  all.unshift(vehicle);
  await persist(all);
  return vehicle;
}

export async function updateVehicle(
  id: string,
  patch: Partial<VehicleInput>,
): Promise<StoredVehicle> {
  const all = await ensureStore();
  const idx = all.findIndex((v) => v.id === id);
  if (idx === -1) throw new Error("Vehículo no encontrado");
  const current = all[idx]!;
  const updated: StoredVehicle = { ...current, ...patch };
  all[idx] = updated;
  await persist(all);
  return updated;
}

export async function deleteVehicle(id: string): Promise<void> {
  const all = await ensureStore();
  await persist(all.filter((v) => v.id !== id));
}
