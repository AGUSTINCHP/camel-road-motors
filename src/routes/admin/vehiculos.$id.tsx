import { createFileRoute, redirect, useNavigate, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import {
  adminGetVehicle,
  adminListVehicles,
  adminUpdateVehicle,
  fetchAdminSession,
} from "@/lib/vehicles.server";
import { VehicleForm, type VehicleFormValues } from "@/components/admin/VehicleForm";

export const Route = createFileRoute("/admin/vehiculos/$id")({
  beforeLoad: async () => {
    const session = await fetchAdminSession();
    if (!session.isAdmin) throw redirect({ to: "/admin/login" });
  },
  loader: async ({ params }) => {
    const [vehicle, vehicles] = await Promise.all([
      adminGetVehicle({ data: params.id }),
      adminListVehicles(),
    ]);
    if (!vehicle) throw notFound();
    return { vehicle, vehicles };
  },
  component: EditarVehiculo,
});

function EditarVehiculo() {
  const { vehicle, vehicles } = Route.useLoaderData();
  const navigate = useNavigate();

  async function handleSubmit(values: VehicleFormValues) {
    await adminUpdateVehicle({ data: { id: vehicle.id, patch: values } });
    await navigate({ to: "/admin" });
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background px-6 py-5">
        <Link to="/admin" className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Volver al stock
        </Link>
        <h1 className="mt-2 text-2xl">
          Editar {vehicle.brand} {vehicle.model}
        </h1>
      </header>
      <VehicleForm
        initial={vehicle}
        onSubmit={handleSubmit}
        submitLabel="Guardar cambios"
        suggestionSource={vehicles}
      />
    </div>
  );
}
