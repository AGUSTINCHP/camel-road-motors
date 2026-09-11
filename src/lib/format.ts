import type { Currency } from "@/data/vehicles";

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export const formatPesos = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

/** Formatea un precio en la moneda real en la que fue publicado el vehículo. */
export const formatMoney = (value: number, currency: Currency) =>
  currency === "ARS" ? formatPesos(value) : formatPrice(value);

export const formatKm = (value: number) =>
  `${new Intl.NumberFormat("es-AR").format(value)} km`;
