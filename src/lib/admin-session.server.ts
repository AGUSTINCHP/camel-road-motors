// Server-only. Sesión simple para el panel de administración: una sola
// contraseña (ADMIN_PASSWORD en .env) protege /admin/*. No hay usuarios
// individuales — es un panel interno para el dueño del negocio.
import { useSession } from "@tanstack/react-start/server";

type AdminSessionData = { isAdmin?: boolean };

const SESSION_SECRET =
  process.env["ADMIN_SESSION_SECRET"] ?? "suzuki-motors-dev-secret-cambiar-en-produccion";

function getAdminSession() {
  return useSession<AdminSessionData>({
    password: SESSION_SECRET,
    name: "suzuki_admin_session",
  });
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getAdminSession();
  return session.data.isAdmin === true;
}

export async function loginAdmin(password: string): Promise<boolean> {
  const expected = process.env["ADMIN_PASSWORD"] ?? "suzuki2026";
  if (password !== expected) return false;
  const session = await getAdminSession();
  await session.update({ isAdmin: true });
  return true;
}

export async function logoutAdmin(): Promise<void> {
  const session = await getAdminSession();
  await session.clear();
}

export async function requireAdmin(): Promise<void> {
  const ok = await isAdminAuthenticated();
  if (!ok) throw new Error("No autorizado");
}
