import { createFileRoute, redirect, useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { adminCreateVehicle, fetchAdminSession } from "@/lib/vehicles.server";
import { VehicleForm, type VehicleFormValues } from "@/components/admin/VehicleForm";

export const Route = createFileRoute("/admin/vehiculos/nuevo")({
  beforeLoad: async () => {
    const session = await fetchAdminSession();
    if (!session.isAdmin) throw redirect({ to: "/admin/login" });
  },
  component: NuevoVehiculo,
});

function NuevoVehiculo() {
  const navigate = useNavigate();

  async function handleSubmit(values: VehicleFormValues) {
    await adminCreateVehicle({ data: values });
    await navigate({ to: "/admin" });
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background px-6 py-5">
        <Link to="/admin" className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Volver al stock
        </Link>
        <h1 className="mt-2 text-2xl">Cargar vehículo</h1>
      </header>
      <VehicleForm onSubmit={handleSubmit} submitLabel="Publicar vehículo" />
    </div>
  );
}
