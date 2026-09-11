export function whatsappUrl(message: string, number: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
