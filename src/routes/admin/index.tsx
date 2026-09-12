import { useMemo, useState } from "react";
import { createFileRoute, redirect, useRouter, Link } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, LogOut, Eye, EyeOff, FileText } from "lucide-react";
import {
  adminDeleteVehicle,
  adminListVehicles,
  adminUpdateVehicle,
  fetchAdminSession,
  logoutAdminFn,
} from "@/lib/vehicles.server";
import { TYPE_LABEL, type VehicleType } from "@/data/vehicles";
import { formatMoney, formatPrice } from "@/lib/format";
import { toUsdEquivalent } from "@/lib/currency";
import { useSiteContent } from "@/lib/site-content-context";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/")({
  beforeLoad: async () => {
    const session = await fetchAdminSession();
    if (!session.isAdmin) throw redirect({ to: "/admin/login" });
  },
  loader: async () => adminListVehicles(),
  component: AdminDashboard,
});

const money = new Intl.NumberFormat("es-AR");
const ALL = "__all__";

const TABS: (VehicleType | "todos")[] = ["todos", "auto", "camioneta", "moto", "cuatriciclo", "lancha"];

function AdminDashboard() {
  const vehicles = Route.useLoaderData();
  const { settings } = useSiteContent();
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [tab, setTab] = useState<VehicleType | "todos">("todos");
  const [brand, setBrand] = useState(ALL);
  const [model, setModel] = useState(ALL);
  const [year, setYear] = useState(ALL);
  const [priceBucket, setPriceBucket] = useState(ALL);

  const counts = useMemo(() => {
    const byType: Partial<Record<VehicleType, number>> = {};
    for (const v of vehicles) byType[v.type] = (byType[v.type] ?? 0) + 1;
    return byType;
  }, [vehicles]);

  const byTab = useMemo(
    () => (tab === "todos" ? vehicles : vehicles.filter((v) => v.type === tab)),
    [vehicles, tab],
  );

  const brandOptions = useMemo(
    () => Array.from(new Set(byTab.map((v) => v.brand))).sort(),
    [byTab],
  );

  const modelOptions = useMemo(
    () =>
      Array.from(
        new Set(byTab.filter((v) => brand === ALL || v.brand === brand).map((v) => v.model)),
      ).sort(),
    [byTab, brand],
  );

  const yearOptions = useMemo(
    () => Array.from(new Set(byTab.map((v) => v.year))).sort((a, b) => b - a),
    [byTab],
  );

  // Precio en franjas: se arma en dólares de referencia para que un stock
  // mezclado (ARS y USD) se pueda filtrar en una sola escala — igual que el
  // slider de precio del catálogo público.
  const priceBuckets = useMemo(() => {
    if (byTab.length === 0) return [];
    const usdPrices = byTab.map((v) => toUsdEquivalent(v.price, v.currency, settings.arsPerUsd));
    const min = Math.min(...usdPrices);
    const max = Math.max(...usdPrices);
    if (min === max) return [{ label: formatPrice(min), min, max }];
    const count = 4;
    const step = (max - min) / count;
    return Array.from({ length: count }, (_, i) => {
      const bMin = min + step * i;
      const bMax = i === count - 1 ? max : min + step * (i + 1);
      return {
        label: `${formatPrice(Math.round(bMin))} – ${formatPrice(Math.round(bMax))}`,
        min: bMin,
        max: bMax,
      };
    });
  }, [byTab, settings.arsPerUsd]);

  const filtered = useMemo(() => {
    const bucket = priceBucket === ALL ? null : priceBuckets[Number(priceBucket)];
    return byTab.filter((v) => {
      if (brand !== ALL && v.brand !== brand) return false;
      if (model !== ALL && v.model !== model) return false;
      if (year !== ALL && String(v.year) !== year) return false;
      if (bucket) {
        const usd = toUsdEquivalent(v.price, v.currency, settings.arsPerUsd);
        if (usd < bucket.min || usd > bucket.max) return false;
      }
      return true;
    });
  }, [byTab, brand, model, year, priceBucket, priceBuckets, settings.arsPerUsd]);

  function resetFilters() {
    setBrand(ALL);
    setModel(ALL);
    setYear(ALL);
    setPriceBucket(ALL);
  }

  async function handleDelete(id: string, label: string) {
    if (!window.confirm(`¿Eliminar "${label}" del stock? Esta acción no se puede deshacer.`)) return;
    setBusyId(id);
    try {
      await adminDeleteVehicle({ data: id });
      await router.invalidate();
    } finally {
      setBusyId(null);
    }
  }

  async function togglePublished(id: string, published: boolean) {
    setBusyId(id);
    try {
      await adminUpdateVehicle({ data: { id, patch: { published: !published } } });
      await router.invalidate();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-background px-6 py-5">
        <div>
          <p className="eyebrow text-camel">Suzuki Motors</p>
          <h1 className="mt-1 text-2xl">Stock ({vehicles.length})</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/contenido">
            <Button variant="outline">
              <FileText className="mr-1.5 h-4 w-4" /> Contenido del sitio
            </Button>
          </Link>
          <Link to="/admin/vehiculos/nuevo">
            <Button>
              <Plus className="mr-1.5 h-4 w-4" /> Cargar vehículo
            </Button>
          </Link>
          <Button
            variant="ghost"
            onClick={async () => {
              await logoutAdminFn();
              router.navigate({ to: "/admin/login" });
            }}
          >
            <LogOut className="mr-1.5 h-4 w-4" /> Salir
          </Button>
        </div>
      </header>

      <div className="flex flex-wrap gap-2 border-b border-border bg-background px-6 py-4">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setTab(t);
              resetFilters();
            }}
            className={
              "border px-4 py-2 text-xs uppercase tracking-[0.12em] transition " +
              (tab === t
                ? "border-camel bg-camel text-accent-foreground"
                : "border-border hover:border-camel")
            }
          >
            {t === "todos" ? "Todos" : TYPE_LABEL[t]}{" "}
            <span className="opacity-70">
              ({t === "todos" ? vehicles.length : counts[t] ?? 0})
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-3 border-b border-border bg-background px-6 py-4">
        <div className="w-40 space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Marca</p>
          <Select
            value={brand}
            onValueChange={(v) => {
              setBrand(v);
              setModel(ALL);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todas</SelectItem>
              {brandOptions.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-40 space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Modelo</p>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos</SelectItem>
              {modelOptions.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-32 space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Año</p>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos</SelectItem>
              {yearOptions.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-52 space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Precio (ref. USD)</p>
          <Select value={priceBucket} onValueChange={setPriceBucket}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos</SelectItem>
              {priceBuckets.map((b, i) => (
                <SelectItem key={i} value={String(i)}>
                  {b.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {brand !== ALL || model !== ALL || year !== ALL || priceBucket !== ALL ? (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Limpiar filtros
          </Button>
        ) : null}
      </div>

      <div className="overflow-x-auto p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehículo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Año</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Km</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((v) => (
              <TableRow key={v.id} className={busyId === v.id ? "opacity-50" : undefined}>
                <TableCell className="font-medium">
                  {v.brand} {v.model} <span className="text-muted-foreground">{v.version}</span>
                </TableCell>
                <TableCell>{TYPE_LABEL[v.type]}</TableCell>
                <TableCell>{v.year}</TableCell>
                <TableCell>{formatMoney(v.price, v.currency)}</TableCell>
                <TableCell>{money.format(v.km)} km</TableCell>
                <TableCell>
                  <button
                    type="button"
                    onClick={() => togglePublished(v.id, v.published)}
                    className="flex items-center gap-1.5 text-xs uppercase tracking-wide"
                  >
                    {v.published ? (
                      <>
                        <Eye className="h-3.5 w-3.5 text-camel" /> Publicado
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3.5 w-3.5 text-muted-foreground" /> Pausado
                      </>
                    )}
                  </button>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link to="/admin/vehiculos/$id" params={{ id: v.id }}>
                      <Button variant="outline" size="icon" aria-label="Editar">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Eliminar"
                      onClick={() => handleDelete(v.id, `${v.brand} ${v.model}`)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  {vehicles.length === 0
                    ? "Todavía no cargaste ningún vehículo."
                    : "Ningún vehículo coincide con estos filtros."}
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
