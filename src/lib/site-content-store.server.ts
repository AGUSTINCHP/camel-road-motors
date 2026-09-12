// Server-only. Persiste el contenido editable del sitio (textos de Home,
// Gestoría, Seguros, financiación, datos de contacto y configuración) en
// Supabase (tabla `site_content`, una sola fila "singleton"), vía el
// cliente admin que bypassa RLS. Se siembra una sola vez con los textos
// actuales del sitio la primera vez que se lee.
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ROW_ID = "singleton";

export type ListItem = { title: string; text: string };
export type CoverageItem = { name: string; items: string[] };
export type Pillar = { title: string; text: string };

export type SiteContent = {
  contact: {
    whatsappNumber: string;
    whatsappDisplay: string;
    hours: string;
    instagramUrl: string;
    facebookUrl: string;
    zones: ListItem[];
  };
  home: {
    heroEyebrow: string;
    heroTitle: string;
    heroSubtitle: string;
    /** URL subida desde el panel. Vacío = usar la foto de fondo por defecto del sitio. */
    heroImage: string;
    aboutTitle: string;
    aboutText: string;
    pillars: [Pillar, Pillar, Pillar];
  };
  gestoria: {
    heroTitle: string;
    /** URL subida desde el panel. Vacío = usar la foto por defecto del sitio. */
    heroImage: string;
    intro: string;
    servicios: ListItem[];
    pasos: ListItem[];
    ctaTitle: string;
    ctaText: string;
    whatsappSubject: string;
  };
  seguros: {
    heroTitle: string;
    /** URL subida desde el panel. Vacío = usar la foto por defecto del sitio. */
    heroImage: string;
    intro: string;
    coberturas: { name: string; text: string; items: string[] }[];
    beneficios: string[];
    ctaTitle: string;
    ctaText: string;
    whatsappSubject: string;
  };
  financing: {
    title: string;
    text: string;
  };
  settings: {
    arsPerUsd: number;
  };
};

const DEFAULT_CONTENT: SiteContent = {
  contact: {
    whatsappNumber: "5491136034046",
    whatsappDisplay: "+54 9 11 3603-4046",
    hours: "Lunes a sábado, 9 a 19 h",
    instagramUrl: "https://instagram.com",
    facebookUrl: "https://facebook.com",
    zones: [
      { title: "Pilar", text: "Autos y pick-ups" },
      { title: "El Talar / Tigre", text: "Náutica y cuatriciclos" },
      { title: "Pacheco", text: "Motos y autos compactos" },
      { title: "Malvinas Argentinas", text: "Autos y utilitarios" },
    ],
  },
  home: {
    heroEyebrow: "Desde 2009 en San Martín",
    heroTitle: "Usados elegidos uno por uno.",
    heroSubtitle:
      "<p>Autos, motos, cuatriciclos y lanchas verificados. Te acompañamos con la gestoría y el seguro para que salgas andando.</p>",
    heroImage: "",
    aboutTitle: "Un concesionario de barrio con estándares de agencia premium.",
    aboutText:
      "<p>Somos una familia dedicada a la compra y venta de vehículos usados. Cada unidad pasa por revisión mecánica, control de service y verificación de documentación antes de entrar al salón.</p><p>Trabajamos con toma de usados, financiación propia y acompañamiento completo en la transferencia y el seguro.</p>",
    pillars: [
      { title: "Venta de usados", text: "Unidades revisadas mecánica y documentalmente antes de publicarse." },
      { title: "Gestoría automotor", text: "Transferencias de dominio, altas, bajas y formularios sin vueltas." },
      { title: "Seguros", text: "Coberturas para autos, motos y náutica con asesoramiento propio." },
    ],
  },
  gestoria: {
    heroTitle: "Gestoría automotor",
    heroImage: "",
    intro:
      "<p>Hacemos toda la parte administrativa de tu vehículo: transferencias, informes y trámites en registro seccional, con seguimiento personalizado.</p>",
    servicios: [
      { title: "Transferencia de dominio", text: "Compraventa entre particulares o con agencia, con firma certificada." },
      { title: "Altas y bajas", text: "Inscripciones iniciales, bajas por desarme y cambios de radicación." },
      { title: "Informes y verificaciones", text: "Informe de dominio, histórico y verificación policial." },
      { title: "Duplicados y cédulas", text: "Cédula azul, duplicado de título y denuncia de venta." },
      { title: "Patentes y libre deuda", text: "Gestión de libre deuda de patentes e infracciones." },
      { title: "Prendas", text: "Inscripción y cancelación de prenda con entidades financieras." },
    ],
    pasos: [
      { title: "Consulta", text: "Nos contás el trámite por WhatsApp y te decimos qué documentación hace falta." },
      { title: "Documentación", text: "Coordinamos firmas certificadas y armamos la carpeta completa." },
      { title: "Presentación", text: "Presentamos en el registro seccional que corresponde y seguimos el estado." },
      { title: "Entrega", text: "Te entregamos título y cédulas nuevas, con todo verificado." },
    ],
    ctaTitle: "¿Tenés un trámite para resolver?",
    ctaText: "Contanos tu caso y te pasamos costos y plazos.",
    whatsappSubject: "Quería consultar por un trámite de gestoría automotor.",
  },
  seguros: {
    heroTitle: "Seguros",
    heroImage: "",
    intro:
      "<p>Te ayudamos a elegir la cobertura justa para tu vehículo, sin pagar de más y con respaldo real cuando pasa algo.</p>",
    coberturas: [
      {
        name: "Responsabilidad civil",
        text: "La cobertura obligatoria para circular, con auxilio y remolque incluidos.",
        items: ["Responsabilidad civil ante terceros", "Auxilio mecánico", "Remolque"],
      },
      {
        name: "Terceros completo",
        text: "Suma robo, incendio y cristales a la cobertura básica.",
        items: ["Robo e incendio total", "Cristales y cerraduras", "Granizo opcional"],
      },
      {
        name: "Todo riesgo",
        text: "Máxima protección con franquicia a medida del valor del vehículo.",
        items: ["Daño parcial y total", "Robo total y parcial", "Auto sustituto"],
      },
    ],
    beneficios: [
      "Cotizamos en varias compañías y te mostramos la comparativa",
      "Alta inmediata al momento de retirar la unidad",
      "Asesoramiento propio ante siniestros",
      "Coberturas náuticas y para cuatriciclos",
    ],
    ctaTitle: "Pedí tu cotización",
    ctaText: "Contanos qué vehículo tenés y te pasamos opciones el mismo día.",
    whatsappSubject: "Quería cotizar un seguro para mi vehículo.",
  },
  financing: {
    title: "Financiá tu compra",
    text:
      "<p>Trabajamos con entidades financieras para que puedas acceder a este vehículo en cuotas. Contanos tu caso por WhatsApp y te asesoramos con la opción que más te convenga.</p>",
  },
  settings: {
    arsPerUsd: 1000,
  },
};

async function ensureRow(): Promise<SiteContent> {
  const { data, error } = await supabaseAdmin
    .from("site_content")
    .select("data")
    .eq("id", ROW_ID)
    .maybeSingle();
  if (error) throw new Error(error.message);

  if (!data) {
    const { error: insertError } = await supabaseAdmin
      .from("site_content")
      .insert({ id: ROW_ID, data: DEFAULT_CONTENT });
    if (insertError) throw new Error(insertError.message);
    return DEFAULT_CONTENT;
  }

  // Merge sobre el default para que una fila vieja (de antes de agregar una
  // sección nueva) no rompa el sitio: lo que falta = valor de fábrica.
  const stored = data.data as Partial<SiteContent>;
  return {
    contact: { ...DEFAULT_CONTENT.contact, ...stored.contact },
    home: { ...DEFAULT_CONTENT.home, ...stored.home },
    gestoria: { ...DEFAULT_CONTENT.gestoria, ...stored.gestoria },
    seguros: { ...DEFAULT_CONTENT.seguros, ...stored.seguros },
    financing: { ...DEFAULT_CONTENT.financing, ...stored.financing },
    settings: { ...DEFAULT_CONTENT.settings, ...stored.settings },
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  return ensureRow();
}

export async function updateSiteContentSection<K extends keyof SiteContent>(
  section: K,
  value: SiteContent[K],
): Promise<SiteContent> {
  const current = await ensureRow();
  const next: SiteContent = { ...current, [section]: value };
  const { error } = await supabaseAdmin
    .from("site_content")
    .upsert({ id: ROW_ID, data: next, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
  return next;
}
