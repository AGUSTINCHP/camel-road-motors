// Server-only. Saneamiento defensivo y liviano para el HTML que produce el
// editor de texto enriquecido del panel (Tiptap con negrita/cursiva/listas/
// enlaces). No es un sanitizador de propósito general para HTML de terceros
// — el único que escribe este contenido es el dueño del negocio, autenticado
// contra el panel — pero igual conviene no persistir <script>, atributos
// "on*" o links "javascript:" por las dudas.
export function sanitizeRichText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/href\s*=\s*"javascript:[^"]*"/gi, 'href="#"')
    .replace(/href\s*=\s*'javascript:[^']*'/gi, "href='#'");
}
