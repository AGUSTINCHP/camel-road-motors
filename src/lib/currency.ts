import type { Currency } from "@/data/vehicles";
import { formatPrice } from "@/lib/format";

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

/** Precio y costo pueden estar en monedas distintas — se comparan en dólares de referencia. */
export function formatMargin(
  price: number,
  priceCurrency: Currency,
  cost: number,
  costCurrency: Currency,
  arsPerUsd: number,
): string {
  const priceUsd = toUsdEquivalent(price, priceCurrency, arsPerUsd);
  const costUsd = toUsdEquivalent(cost, costCurrency, arsPerUsd);
  const margin = priceUsd - costUsd;
  const pct = costUsd > 0 ? Math.round((margin / costUsd) * 100) : 0;
  return `${formatPrice(margin)} (${pct >= 0 ? "+" : ""}${pct}% sobre el costo)`;
}
