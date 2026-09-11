import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSiteContent, updateSiteContentSection, type SiteContent } from "@/lib/site-content-store.server";
import { sanitizeRichText } from "@/lib/sanitize-html.server";
import { requireAdmin } from "@/lib/admin-session.server";

// ---------- Pública ----------

export const fetchSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  return getSiteContent();
});

// ---------- Admin (protegido) ----------

const listItemSchema = z.object({ title: z.string().min(1), text: z.string().min(1) });

const contactSchema = z.object({
  whatsappNumber: z.string().min(6),
  whatsappDisplay: z.string().min(1),
  hours: z.string().min(1),
  instagramUrl: z.string(),
  facebookUrl: z.string(),
  zones: z.array(listItemSchema).min(1),
});

const homeSchema = z.object({
  heroEyebrow: z.string().min(1),
  heroTitle: z.string().min(1),
  heroSubtitle: z.string().min(1),
  heroImage: z.string(),
  aboutTitle: z.string().min(1),
  aboutText: z.string().min(1),
  pillars: z.tuple([listItemSchema, listItemSchema, listItemSchema]),
});

const gestoriaSchema = z.object({
  heroTitle: z.string().min(1),
  heroImage: z.string(),
  intro: z.string().min(1),
  servicios: z.array(listItemSchema).min(1),
  pasos: z.array(listItemSchema).min(1),
  ctaTitle: z.string().min(1),
  ctaText: z.string().min(1),
  whatsappSubject: z.string().min(1),
});

const coberturaSchema = z.object({
  name: z.string().min(1),
  text: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
});

const segurosSchema = z.object({
  heroTitle: z.string().min(1),
  heroImage: z.string(),
  intro: z.string().min(1),
  coberturas: z.array(coberturaSchema).min(1),
  beneficios: z.array(z.string().min(1)).min(1),
  ctaTitle: z.string().min(1),
  ctaText: z.string().min(1),
  whatsappSubject: z.string().min(1),
});

const financingSchema = z.object({
  title: z.string().min(1),
  text: z.string().min(1),
});

const settingsSchema = z.object({
  arsPerUsd: z.coerce.number().positive(),
});

export const adminUpdateContact = createServerFn({ method: "POST" })
  .inputValidator((input: SiteContent["contact"]) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    await requireAdmin();
    return updateSiteContentSection("contact", data);
  });

export const adminUpdateHome = createServerFn({ method: "POST" })
  .inputValidator((input: SiteContent["home"]) => homeSchema.parse(input))
  .handler(async ({ data }) => {
    await requireAdmin();
    return updateSiteContentSection("home", {
      ...data,
      heroSubtitle: sanitizeRichText(data.heroSubtitle),
      aboutText: sanitizeRichText(data.aboutText),
    });
  });

export const adminUpdateGestoria = createServerFn({ method: "POST" })
  .inputValidator((input: SiteContent["gestoria"]) => gestoriaSchema.parse(input))
  .handler(async ({ data }) => {
    await requireAdmin();
    return updateSiteContentSection("gestoria", { ...data, intro: sanitizeRichText(data.intro) });
  });

export const adminUpdateSeguros = createServerFn({ method: "POST" })
  .inputValidator((input: SiteContent["seguros"]) => segurosSchema.parse(input))
  .handler(async ({ data }) => {
    await requireAdmin();
    return updateSiteContentSection("seguros", { ...data, intro: sanitizeRichText(data.intro) });
  });

export const adminUpdateFinancing = createServerFn({ method: "POST" })
  .inputValidator((input: SiteContent["financing"]) => financingSchema.parse(input))
  .handler(async ({ data }) => {
    await requireAdmin();
    return updateSiteContentSection("financing", { ...data, text: sanitizeRichText(data.text) });
  });

export const adminUpdateSettings = createServerFn({ method: "POST" })
  .inputValidator((input: SiteContent["settings"]) => settingsSchema.parse(input))
  .handler(async ({ data }) => {
    await requireAdmin();
    return updateSiteContentSection("settings", data);
  });
