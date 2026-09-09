export const WHATSAPP_NUMBER = "5491136034046";
export const WHATSAPP_DISPLAY = "+54 9 11 3603-4046";

export function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
