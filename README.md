# Suzuki Motors Hub

Crear el sitio web para Suzuki Motors (compra-venta de vehículos usados: autos, motos, cuatriciclos y lanchas, más servicios de gestoría automotor y seguros).

Estética: Premium y cálida. Paleta blanco, negro y acento camel/tierra. Tipografía editorial prolija. Logo wordmark "SUZUKI" en líneas paralelas/trazo múltiple. Mobile-first muy fluido.

Estructura y funcionalidades:
1. Home: Hero con imagen/video de fondo, llamada al catálogo, destacados (3-6 vehículos), recién llegados, sección sobre nosotros breve, y franja con los 3 pilares (Venta de usados, Gestoría automotor, Seguros).
2. Catálogo: Grilla con cards completas (foto, marca, modelo, año, precio, kilometraje). Filtros combinables en tiempo real (sidebar desktop, drawer mobile) por tipo (auto, moto, cuatriciclo, lancha), marca, modelo, slider de precio, slider de kilometraje y año. Mock data variado y realista con decenas de vehículos.
3. Ficha de vehículo (/catalogo/:slug): Galería de fotos, badge/checklist de vehículo verificado (motor, service, papeles al día), specs completas, simulador interactivo de financiación (anticipo + cuotas), comparador para guardar hasta 3 vehículos lado a lado, y CTA "Consultar por WhatsApp".
4. Flujo de WhatsApp: Modal previo al pulsar consultar (nombre, apellido, zona/localidad, vehículo precargado) que redirige a WhatsApp (+54 9 11 3603-4046) con mensaje prearmado. Botón flotante de WhatsApp accesible en todo el sitio.
5. "Avisame cuando entre algo así": Formulario de captura de leads para vehículos no disponibles en stock.
6. Página /gestoria: Servicios de transferencias de dominio, pasos del proceso y CTA WhatsApp con modal.
7. Página /seguros: Coberturas, beneficios y CTA WhatsApp con modal.
8. Footer completo y meta tags SEO para cada página y vehículo.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a50606b8-754c-4e65-a83c-a96e753d2425).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
