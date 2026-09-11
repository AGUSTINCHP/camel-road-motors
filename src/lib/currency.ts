import type { Currency } from "@/data/vehicles";

export type { Currency };

/**
 * Convierte un precio a su equivalente en dólares usando el tipo de cambio
 * de referencia configurado en el panel (Configuración). Se usa solo
 * internamente para poder ordenar y filtrar el catálogo por precio cuando
 * hay vehículos publicados en dólares y en pesos al mismo tiempo (el slider
 * de precio necesita una sola escala numérica). No se le muestra al
 * comprador en ningún lado: cada ficha siempre muestra el precio real que
 * cargó el admin, en su moneda original.
 */
export function toUsdEquivalent(price: number, currency: Currency, arsPerUsd: number): number {
  return currency === "ARS" ? price / arsPerUsd : price;
}
