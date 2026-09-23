// Parser y armado de CSV para la carga masiva de stock desde una planilla.
// Deliberadamente liviano (sin dependencias) — soporta comillas con comas,
// saltos de línea y comillas escapadas adentro de un campo (RFC 4180 básico).

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  const pushField = () => {
    row.push(field);
    field = "";
  };
  const pushRow = () => {
    pushField();
    rows.push(row);
    row = [];
  };

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
      continue;
    }
    if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      pushField();
    } else if (c === "\n") {
      pushRow();
    } else if (c === "\r") {
      // ignorado, \n lo maneja
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) pushRow();

  return rows.filter((r) => r.some((cell) => cell.trim().length > 0));
}

function normalizeHeader(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

const HEADERS = [
  "tipo",
  "marca",
  "modelo",
  "version",
  "anio",
  "precio",
  "moneda",
  "costo",
  "moneda costo",
  "km",
  "combustible",
  "transmision",
  "motor",
  "color",
  "ubicacion",
  "puertas",
  "destacado",
  "caracteristicas",
] as const;

export type BulkVehicleRow = {
  type: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  /** Precio al público. */
  price: number;
  currency: string;
  /** Costo de adquisición — interno, nunca se muestra en el sitio público. */
  cost?: number | undefined;
  costCurrency?: string | undefined;
  km: number;
  fuel: string;
  transmission: string;
  engine: string;
  color: string;
  location: string;
  doors?: number | undefined;
  featured: boolean;
  highlights: string[];
};

const TRUTHY = new Set(["si", "sí", "true", "1", "x", "yes"]);
const TYPE_ALIASES: Record<string, string> = {
  auto: "auto",
  camioneta: "camioneta",
  moto: "moto",
  cuatriciclo: "cuatriciclo",
  lancha: "lancha",
};
const CURRENCY_ALIASES: Record<string, string> = {
  usd: "USD",
  dolares: "USD",
  dólares: "USD",
  u$s: "USD",
  ars: "ARS",
  pesos: "ARS",
  $: "ARS",
};

/** Convierte las filas crudas del CSV (con encabezado) a objetos listos para mandar al servidor. */
export function csvToVehicleRows(text: string): { rows: BulkVehicleRow[]; skipped: number } {
  const table = parseCsv(text);
  if (table.length === 0) return { rows: [], skipped: 0 };

  const headerRow = table[0]!.map(normalizeHeader);
  const colIndex = new Map(HEADERS.map((h) => [h, headerRow.indexOf(h)]));

  const rows: BulkVehicleRow[] = [];
  let skipped = 0;

  for (const raw of table.slice(1)) {
    const get = (key: (typeof HEADERS)[number]) => {
      const idx = colIndex.get(key);
      return idx !== undefined && idx >= 0 ? (raw[idx] ?? "").trim() : "";
    };

    const brand = get("marca");
    const model = get("modelo");
    if (!brand && !model) {
      skipped++;
      continue;
    }

    const typeRaw = normalizeHeader(get("tipo"));
    const currencyRaw = normalizeHeader(get("moneda"));
    const costCurrencyRaw = normalizeHeader(get("moneda costo"));
    const highlightsRaw = get("caracteristicas");
    const costRaw = get("costo");

    rows.push({
      type: TYPE_ALIASES[typeRaw] ?? "auto",
      brand,
      model,
      version: get("version"),
      year: Number(get("anio")) || new Date().getFullYear(),
      price: Number(get("precio").replace(/[^\d.]/g, "")) || 0,
      currency: CURRENCY_ALIASES[currencyRaw] ?? "USD",
      cost: costRaw ? Number(costRaw.replace(/[^\d.]/g, "")) || undefined : undefined,
      // Si no aclaran la moneda del costo, se asume la misma que la del precio.
      costCurrency: costRaw
        ? (CURRENCY_ALIASES[costCurrencyRaw] ?? CURRENCY_ALIASES[currencyRaw] ?? "USD")
        : undefined,
      km: Number(get("km").replace(/[^\d]/g, "")) || 0,
      fuel: get("combustible") || "Nafta",
      transmission: get("transmision") || "Manual",
      engine: get("motor"),
      color: get("color"),
      location: get("ubicacion"),
      doors: get("puertas") ? Number(get("puertas")) : undefined,
      featured: TRUTHY.has(normalizeHeader(get("destacado"))),
      highlights: highlightsRaw
        ? highlightsRaw
            .split("|")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    });
  }

  return { rows, skipped };
}

export const CSV_TEMPLATE = `tipo,marca,modelo,version,anio,precio,moneda,costo,moneda costo,km,combustible,transmision,motor,color,ubicacion,puertas,destacado,caracteristicas
auto,Toyota,Corolla,XEI CVT,2021,18500,USD,16000000,ARS,42000,Nafta,CVT,1.8,Blanco,Pilar,4,no,Único dueño|Service oficial
moto,Honda,CB 190R,,2022,3200000,ARS,2600000,ARS,8000,Nafta,Manual,190cc,Rojo,El Talar,,si,
`;
