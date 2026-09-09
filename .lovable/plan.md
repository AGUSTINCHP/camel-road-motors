# Suzuki Motors — sitio web

Sitio de compra-venta de usados (autos, motos, cuatriciclos y lanchas) con gestoría y seguros. Estética premium y cálida: blanco, negro y acento camel/tierra, tipografía editorial, mobile-first.

## Páginas

**Inicio (/)**
- Hero a pantalla completa con imagen de fondo y llamada al catálogo.
- Destacados (6 vehículos) y "Recién llegados".
- Bloque breve "Sobre nosotros".
- Franja con los 3 pilares: Venta de usados · Gestoría automotor · Seguros.

**Catálogo (/catalogo)**
- Grilla de tarjetas: foto, marca, modelo, año, precio y kilometraje.
- Filtros combinables que actualizan al instante: tipo, marca, modelo, precio, kilometraje y año. Barra lateral en computadora, panel deslizante en celular.
- Datos de muestra variados y realistas (unos 40 vehículos).
- Si no hay resultados, aparece el formulario "Avisame cuando entre algo así".

**Ficha de vehículo (/catalogo/:slug)**
- Galería de fotos.
- Sello de vehículo verificado con checklist (motor, service, papeles al día).
- Ficha técnica completa.
- Simulador de financiación: anticipo y cantidad de cuotas, cuota calculada en vivo.
- Comparador: guardar hasta 3 vehículos y verlos lado a lado.
- Botón "Consultar por WhatsApp".

**Gestoría (/gestoria)** — transferencias de dominio, pasos del proceso, CTA WhatsApp.

**Seguros (/seguros)** — coberturas, beneficios, CTA WhatsApp.

## Funcionalidad transversal

- Modal antes de ir a WhatsApp: nombre, apellido, zona/localidad y el vehículo ya cargado; abre WhatsApp al +54 9 11 3603-4046 con el mensaje armado.
- Botón flotante de WhatsApp en todas las páginas.
- Encabezado con el wordmark "SUZUKI" de trazo múltiple y navegación; pie de página completo.
- Títulos y descripciones propios para cada página y para cada vehículo.

## Detalles técnicos

- Rutas TanStack: `index`, `catalogo.index`, `catalogo.$slug`, `gestoria`, `seguros`; `head()` por ruta con title/description/og.
- Tokens de color, radios y tipografía en `src/styles.css` (`@theme inline`); fuentes vía `<link>` en `__root.tsx` (display serif editorial + sans neutra).
- Datos mock tipados en `src/data/vehicles.ts`; filtrado en cliente con `useMemo`.
- Comparador y leads en estado local (`localStorage`), sin backend en esta etapa.
- Componentes en `src/components/`: `Header`, `Footer`, `WhatsAppFab`, `WhatsAppModal`, `VehicleCard`, `FilterPanel`, `FinanceSimulator`, `CompareBar`, `NotifyForm`.
- Imágenes de hero y de vehículos generadas y guardadas en `src/assets/`.

## Fuera de alcance por ahora

Los formularios no guardan datos en una base ni envían correos: el contacto se resuelve por WhatsApp. Si querés guardar los leads, se agrega después con Lovable Cloud.
