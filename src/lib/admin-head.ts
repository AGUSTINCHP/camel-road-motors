// Metadatos para poder "instalar" el panel de admin en la pantalla de
// inicio del celular (ícono propio, abre directo en /admin, sin barra de
// navegación del browser). No hace falta service worker para esto: alcanza
// con el manifest + los meta tags de iOS.
export const ADMIN_HEAD = {
  meta: [
    { name: "theme-color", content: "#161616" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
    { name: "apple-mobile-web-app-title", content: "SM Admin" },
  ],
  links: [
    { rel: "manifest", href: "/admin.webmanifest" },
    { rel: "apple-touch-icon", href: "/icons/apple-touch-icon.png" },
  ],
};
